import { authOptions } from "@/lib/auth";
import { DoctorProfile } from "@/models/doctorProfile";
import MedicalHistory from "@/models/medicalHistory";
import { patientProfile } from "@/models/patientProfile";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  try {
    const patient = await patientProfile
      .findById(userId)
      .populate("userId", "gender");
    const patientHistory = await MedicalHistory.findOne({
      patientId: userId,
    }).lean();
    const doctors = await DoctorProfile.find({ isActive: true });

    const context = {
      patientProfile: {
        chronicConditions: patientHistory?.chronicConditions || [],
        allergies: patientHistory?.allergies || [],
        demographics: {
          age: patient?.age,
          gender: (patient?.userId as any)?.gender,
        },
      },
      doctorPool: doctors.map((doctor) => ({
        id: doctor.userId,
        specialization: doctor.specialization,
        experience: doctor.experienceYears,
        bio: doctor.bio,
      })),
    };

    const aiPrompt = `
        Act as a Senior Medical Consultant. 
        Based on this Patient Profile: ${JSON.stringify(context.patientProfile)}
        And this list of Doctors: ${JSON.stringify(context.doctorPool)}
        
        Pick the top 1 doctor best suited for this patient. 
        Consider if the doctor's specialization manages their chronic diseases.
        Return ONLY a JSON object: { "doctorId": "ID", "reasoning": "short explanation" }
    `;

    return NextResponse.json({});
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Unable to recommending doctor",
      },
      { status: 500 },
    );
  }
}
