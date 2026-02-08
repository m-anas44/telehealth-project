import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/db/connectDB";
import { User } from "@/models/user";
import { patientProfile } from "@/models/patientProfile";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const profile = await patientProfile.findOne({ userId: session.user.id }).lean();

    const fullProfile = {
      ...user,
      age: profile?.age || "",
      bloodGroup: profile?.bloodGroup || "",
      emergencyContact: profile?.emergencyContact || "",
    };

    return NextResponse.json(fullProfile, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const userId = session.user.id;

    await connectDB();

    const userData: any = {};
    if (body.name) userData.name = body.name;
    if (body.phone) userData.phone = body.phone;
    if (body.gender) userData.gender = body.gender;
    if (body.city) userData.city = body.city;

    const profileData: any = {};
    if (body.age) profileData.age = Number(body.age);
    if (body.bloodGroup) profileData.bloodGroup = body.bloodGroup;
    if (body.emergencyContact) profileData.emergencyContact = body.emergencyContact;

    if (Object.keys(userData).length > 0) {
      await User.findByIdAndUpdate(userId, { $set: userData });
    }

    if (Object.keys(profileData).length > 0) {
      await patientProfile.findOneAndUpdate(
        { userId: userId },
        { $set: profileData },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}