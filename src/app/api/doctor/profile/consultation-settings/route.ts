import mongoose from "mongoose";
import connectDB from "@/db/connectDB";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DoctorProfile } from "@/models/doctorProfile";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    await connectDB();

    const profile = await DoctorProfile.findOne(
      { userId: new mongoose.Types.ObjectId(session.user.id) },
      {
        consultationDuration: 1,
        bufferTime: 1,
        consultationTypes: 1,
      }
    ).lean();

    return NextResponse.json(
      {
        consultationDuration: profile?.consultationDuration ?? 30,
        bufferTime: profile?.bufferTime ?? 0,
        consultationTypes: profile?.consultationTypes ?? {
          video: true,
          inPerson: true,
          phone: false,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch consultation settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const body = await req.json();
    const {
      consultationDuration,
      bufferTime,
      consultationTypes,
    } = body;

    // 🔒 Validation: at least one consultation type must be enabled
    if (
      !consultationTypes ||
      !Object.values(consultationTypes).some(Boolean)
    ) {
      return NextResponse.json(
        { message: "At least one consultation type must be selected" },
        { status: 400 }
      );
    }

    await connectDB();

    await DoctorProfile.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(session.user.id) },
      {
        $set: {
          consultationDuration,
          bufferTime,
          consultationTypes,
        },
      },
      {
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json(
      { message: "Consultation settings updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to save consultation settings" },
      { status: 500 }
    );
  }
}
