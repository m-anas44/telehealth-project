import { authOptions } from "@/lib/auth";
import { Appointment } from "@/models/appointment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const body = await req.json();
    const userId = session?.user.id;

    const newApt = await Appointment.create({
      ...body,
      status: "pending",
      patientId: userId,
    });

    // also create a chat room immediately so patient/doctor can message
    try {
      const { Room } = await import("@/models/room");
      if (newApt._id && body.doctorId) {
        const existing = await Room.findOne({ appointmentId: newApt._id });
        if (!existing) {
          await Room.create({
            appointmentId: newApt._id,
            doctorId: body.doctorId,
            patientId: userId,
          });
        }
      }
    } catch (e) {
      console.error("error creating room on appointment", e);
    }

    return NextResponse.json(
      {
        message: "Appointment created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error in creating appointment: ", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
