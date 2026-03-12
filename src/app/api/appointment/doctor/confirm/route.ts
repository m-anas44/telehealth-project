import { authOptions } from "@/lib/auth";
import { Appointment } from "@/models/appointment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const { appointmentId } = await req.json();
    const doctorId = session.user.id;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctorId },
      { status: "confirmed" },
      { new: true }
    ).populate("patientId", "name email");

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found or unauthorized" },
        { status: 404 },
      );
    }

    // ensure a chat room exists for this appointment
    try {
      const { Room } = await import("@/models/room");
      const existing = await Room.findOne({ appointmentId: appointment._id });
      if (!existing) {
        await Room.create({
          appointmentId: appointment._id,
          doctorId: doctorId,
          patientId: appointment.patientId,
        });
      }
    } catch (e) {
      console.error("unable to create room on confirm", e);
    }

    return NextResponse.json(
      {
        message: "Appointment confirmed successfully",
        data: appointment,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error confirming appointment:", error);
    return NextResponse.json(
      { message: error.message || "Failed to confirm appointment" },
      { status: 500 },
    );
  }
}
