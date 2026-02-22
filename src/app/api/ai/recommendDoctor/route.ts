import connectDB from "@/db/connectDB";
import { askAI } from "@/lib/ai-service";
import { authOptions } from "@/lib/auth";
import { DoctorProfile } from "@/models/doctorProfile";
import MedicalHistory from "@/models/medicalHistory";
import { patientProfile } from "@/models/patientProfile";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const patientName = session?.user.name;

  try {
    await connectDB();
    const [patient, patientHistory, doctors] = await Promise.all([
      patientProfile
        .findOne({ userId: userId })
        .populate("userId", "gender")
        .lean(),
      MedicalHistory.findOne({ patientId: userId }).lean(),
      DoctorProfile.find({ isActive: true })
        .select("userId specialization experienceYears bio")
        .populate("userId", "name")
        .lean(),
    ]);

    const isHistoryMissing =
      !patientHistory ||
      (patientHistory.chronicConditions?.length === 0 &&
        patientHistory.allergies?.length === 0);

    if (isHistoryMissing || !patient?.age) {
      return NextResponse.json(
        {
          type: "INCOMPLETE_PROFILE",
          message:
            "Complete your medical profile to get personalized AI recommendations.",
        },
        { status: 200 },
      );
    }

    const context = {
      patientName,
      patientProfile: {
        chronicConditions: patientHistory?.chronicConditions?.length
          ? patientHistory.chronicConditions.join(", ")
          : "None reported",
        allergies: patientHistory?.allergies?.length
          ? patientHistory.allergies.join(", ")
          : "None reported",
        demographics: {
          age: patient?.age || "Not provided",
          gender: (patient?.userId as any)?.gender || "Not provided",
        },
      },
      doctorPool: doctors.map((doctor) => ({
        id: doctor.userId,
        name: (doctor.userId as any).name,
        specialization: doctor.specialization,
        experience: doctor.experienceYears,
        bio: doctor.bio,
      })),
    };

    const responseSchema = {
      type: "object",
      properties: {
        doctorId: { type: "string" },
        reasoning: { type: "string" },
      },
      required: ["doctorId", "reasoning"],
    };

    const aiPrompt = `
        SYSTEM: You are a friendly, empathetic AI Health Assistant. 
        Your goal is to recommend a doctor to a patient using warm, simple, and encouraging language.

        STRICT RULES:
        1. ONLY return JSON.
        2. The "reasoning" must be a single, user-friendly sentence.
        3. DO NOT use medical jargon like "specialization manages chronic diseases."
        4. USE a pattern like: "Dr. [Name] would be a wonderful choice to help you with [condition] and get you feeling better."

        DATA:
        Patient: ${context.patientName}
        Profile: ${JSON.stringify(context.patientProfile)}
        Doctors: ${JSON.stringify(context.doctorPool)}

        TASK:
        Pick the best doctor and write a warm 1-sentence recommendation for the "reasoning" field.
    `;

    const aiResponse = await askAI(aiPrompt, responseSchema);
    console.log("AI generated this response: ", aiResponse);

    return NextResponse.json(
      {
        type: "RECOMMENDATION",
        ...aiResponse,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("error in recommending doctor", error.message);
    return NextResponse.json(
      {
        message: error.message || "Unable to recommending doctor",
      },
      { status: 500 },
    );
  }
}
