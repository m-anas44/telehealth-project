import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/db/connectDB";
import { DoctorProfile } from "@/models/doctorProfile";
import mongoose from "mongoose";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();

    await connectDB();

    const profile = await DoctorProfile.findOne(
      { userId: session.user.id },
      { availability: 1 }
    ).lean();

    return NextResponse.json(
      { availability: profile?.availability ?? null },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return unauthorized();

    const body = await req.json();
    const { availability } = body;

    if (!availability?.weekly) {
      return NextResponse.json(
        { message: "Availability data is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const updated = await DoctorProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          availability,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return NextResponse.json(
      { message: "Availability updated", availability: updated.availability },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to save availability" },
      { status: 500 },
    );
  }
}
