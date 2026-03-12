import { authOptions } from "@/lib/auth";
import { Room } from "@/models/room";
import { Appointment } from "@/models/appointment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import mongoose from "mongoose";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const { appointmentId } = await req.json();
    if (!appointmentId || !mongoose.isValidObjectId(appointmentId)) {
      return NextResponse.json({ message: "Invalid appointmentId" }, { status: 400 });
    }

    // ensure appointment exists and user is either doctor or patient of it
    const appointment = await Appointment.findById(appointmentId).lean();
    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    const userId = session.user.id;
    if (
      appointment.patientId.toString() !== userId &&
      appointment.doctorId.toString() !== userId
    ) {
      return unauthorized();
    }

    let room = await Room.findOne({ appointmentId });
    if (!room) {
      room = await Room.create({
        appointmentId,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
      });
    }

    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error("create room error", error);
    return NextResponse.json({ message: "Error creating room" }, { status: 500 });
  }
}
