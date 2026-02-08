import { authOptions } from "@/lib/auth";
import MedicalHistory from "@/models/medicalHistory";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const { allergies, conditions } = await req.json();

    const patientId = session.user.id;

    const updatedRecord = await MedicalHistory.findOneAndUpdate(
      { patientId },
      {
        $set: {
          allergies: allergies,
          chronicConditions: conditions,
        },
      },
      { upsert: true, new: true },
    );

    return NextResponse.json(
      {
        message: "Health summary synced successfully",
        data: updatedRecord,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Summary Sync Error:", error);
    return NextResponse.json(
      { error: "Failed to sync health summary" },
      { status: 500 },
    );
  }
}
