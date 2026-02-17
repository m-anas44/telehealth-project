import { authOptions } from "@/lib/auth";
import { DoctorProfile } from "@/models/doctorProfile";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) return unauthorized();
    const { active } = await req.json();
    const userId = session?.user.id;

    const doctor = await DoctorProfile.findById({
      doctorId: userId,
    });

    doctor!.isActive = active;
    doctor!.save();

    return NextResponse.json(
      {
        message: "Profile updated",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
