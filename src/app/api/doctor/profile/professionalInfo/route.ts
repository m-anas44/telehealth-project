import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import { DoctorProfile } from "@/models/doctorProfile";
import { User } from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    await connectDB();

    const profile = await DoctorProfile.findOne({
      userId: session.user.id,
    }).lean();

    const user = await User.findById(session.user.id)
      .select("name email phone")
      .lean();

    return NextResponse.json({ profile, user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const body = await req.json();
    const {
      specialization,
      experienceYears,
      bio,
      clinicalAddress,
      phone,
      name,
      email,
    } = body;

    const hasAnyField =
      specialization !== undefined ||
      experienceYears !== undefined ||
      bio !== undefined ||
      clinicalAddress !== undefined ||
      phone !== undefined ||
      name !== undefined ||
      email !== undefined;

    if (!hasAnyField) {
      return NextResponse.json(
        { message: "Provide at least one field to update" },
        { status: 400 },
      );
    }

    if (specialization !== undefined && !Array.isArray(specialization)) {
      return NextResponse.json(
        { message: "Specialization must be an array of strings" },
        { status: 400 },
      );
    }

    await connectDB();

    const userId = session.user.id;
    let profile = await DoctorProfile.findOne({ userId });

    if (!profile) {
      profile = await DoctorProfile.create({
        userId,
        specialization: Array.isArray(specialization) ? specialization : [],
        experienceYears:
          typeof experienceYears === "number" ? experienceYears : undefined,
        bio: typeof bio === "string" ? bio : undefined,
        clinicalAddress:
          typeof clinicalAddress === "string" ? clinicalAddress : undefined,
        isActive: true,
      });
    } else {
      if (specialization !== undefined) profile.specialization = specialization;
      if (typeof experienceYears === "number")
        profile.experienceYears = experienceYears;
      if (bio !== undefined) profile.bio = bio;
      if (clinicalAddress !== undefined)
        profile.clinicalAddress = clinicalAddress;

      await profile.save();
    }

    if (name !== undefined || email !== undefined || phone !== undefined) {
      const update: Record<string, any> = {};
      if (name !== undefined) update.name = name;
      if (email !== undefined) update.email = email;
      if (phone !== undefined) update.phone = phone;

      await User.findByIdAndUpdate(userId, update);
    }

    return NextResponse.json({ message: "Profile saved" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to save profile" },
      { status: 500 },
    );
  }
}
