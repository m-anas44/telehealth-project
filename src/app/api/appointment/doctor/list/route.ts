import { authOptions } from "@/lib/auth";
import { Appointment } from "@/models/appointment";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const doctorId = session.user.id;

    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name email")
      .sort({ time: 1 })
      .lean();

    return NextResponse.json(
      {
        message: "Doctor appointments fetched successfully",
        data: appointments,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching doctor appointments:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}
