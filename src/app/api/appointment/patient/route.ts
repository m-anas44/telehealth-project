import connectDB from "@/db/connectDB";
import { authOptions } from "@/lib/auth";
import { Appointment } from "@/models/appointment";
import { DoctorProfile } from "@/models/doctorProfile";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const userId = session.user.id;

    const appointments = await Appointment.find({
      patientId: userId,
    })
      .sort({ time: -1 })
      .populate("doctorId", "name image")
      .lean();

      console.log("apposintments: ", appointments)

    if (!appointments.length) {
      return NextResponse.json({
        message: "No appointments found",
        data: { pending: [], confirmed: [], completed: [], cancelled: [] }
      });
    }

    const doctorIds = appointments
      .map((a: any) => a.doctorId?._id)
      .filter(Boolean);

    console.log("doctor ids: ", doctorIds);

    const doctorProfiles = await DoctorProfile.find({
      userId: { $in: doctorIds },
    })
      .select("userId specialization")
      .lean();

    const profileMap: Record<string, string[]> = {};

    doctorProfiles.forEach((profile: any) => {
      profileMap[profile.userId.toString()] = profile.specialization || [];
    });

    const formattedAppointments = appointments.map((apt: any) => {
      const doctorId = apt.doctorId?._id?.toString();

      return {
        ...apt,
        doctorName: apt.doctorId?.name || "Unknown",
        doctorImage: apt.doctorId?.image || "",
        specialization: doctorId ? profileMap[doctorId] || [] : [],
      };
    });

    const categorizedData = {
      pending: formattedAppointments.filter((a: any) => a.status === "pending"),
      confirmed: formattedAppointments.filter(
        (a: any) => a.status === "confirmed",
      ),
      completed: formattedAppointments.filter(
        (a: any) => a.status === "completed",
      ),
      cancelled: formattedAppointments.filter(
        (a: any) => a.status === "cancelled",
      ),
    };

    console.log("categorized data: ", categorizedData)

    return NextResponse.json(
      {
        message: "Fetched appointments successfully",
        data: categorizedData,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in getting patient appointments:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
