import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import { appointmentTools } from "./appointmentTools";
import * as toolFunctions from "./appointmentToolFunctions";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askAI(prompt: string, responseSchema?: any) {
  try {
    const result = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        maxOutputTokens: 500,
        temperature: 0.1,
      },
    });

    const text = result.text;
    if (!text) {
      throw new Error("Empty AI response");
    }

    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("AI request failed");
  }
}

export async function runMedicalAgent(
  userInput: string,
  history: any[],
  patientId: string,
) {
  try {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const chat = genai.chats.create({
      model: "gemini-3.1-flash-lite-preview",
      history,
      config: {
        temperature: 0.2,
        tools: [appointmentTools],
        systemInstruction: `
          You are a smart medical coordinator. TODAY'S DATE is ${dateString}.

          LOGICAL FRAMEWORK:
          1. SYMPTOM MAPPING: When a user mentions ANY health issue, mentally map it to the most relevant medical specialty (e.g., toothache -> Dentist, heart pain -> Cardiologist) and call 'findDoctors' immediately.
          2. DATE INTELLIGENCE: Use TODAY'S DATE (${dateString}) as your reference. If the user says "tomorrow", "this Friday", or "next week", calculate the exact ISO date (YYYY-MM-DD) yourself before calling any tools.
          3. CONVERSATIONAL FLOW:
            - If user asks about symptoms: Find doctors.
            - If user picks a doctor: Show details and ask for a preferred day.
            - If user mentions a day: Check availability.
              * Always display the available free slots to the user.
              * Only suggest "another day" if there are no free slots.
            - If user picks a slot: Confirm all details (Doctor, Date, Time, Type) before booking.
          4. VOICE CONSTRAINTS: Speak naturally. No markdown (no **bold**, no lists). Keep descriptions under 20 words.
          5. NO REDUNDANCY: Do not ask for information you can already infer (like today's date) or that the user has already provided.
          `,
      },
    });

    let response: GenerateContentResponse = await chat.sendMessage({
      message: userInput,
    });

    let functionCalls = response.functionCalls;

    while (functionCalls && functionCalls.length > 0) {
      const toolResponses: any[] = [];

      for (const call of functionCalls) {
        if (!call.name) continue;

        const tool = (toolFunctions as any)[call.name];

        if (!tool) continue;

        const args =
          call.name === "bookAppointment"
            ? { ...call.args, patientId }
            : call.args;

        const result = await tool(args);

        toolResponses.push({
          functionResponse: {
            name: call.name,
            response: result,
          },
        });
      }

      response = await chat.sendMessage({
        message: toolResponses,
      });

      functionCalls = response.functionCalls;
    }

    return {
      text: response.text,
      history: chat.getHistory(),
    };
  } catch (error: any) {
    console.log("An error occured in running ai agent", error.message);
  }
}

export async function transcribeAudio(
  base64Audio: string,
  mimeType: string,
): Promise<string> {
  try {
    const response = await genai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: "Transcribe the following audio precisely. Return ONLY the transcribed text, nothing else.",
          },
        ],
      },
    });

    console.log("transacribed audio: ", response);

    return response.text || "Sorry, I couldn't hear anything.";
  } catch (error) {
    console.error("error in voice ai service: ", error);
    return "Sorry, I couldn't hear anything. got error!";
  }
}
