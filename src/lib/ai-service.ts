import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askAI(prompt: string, responseSchema?: any) {
  const model = genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      maxOutputTokens: 500,
      temperature: 0.1,
    },
  });

  const response: any = (await model).text;
  console.log("AI response: ", response);
  return JSON.parse(response);
}
