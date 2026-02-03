import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import { DoctorProfile } from "@/models/doctorProfile";
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
    }).select(
      "licenseNo licenseState licenseExpiration medicalSchool residencyProgram boardNameOfCertification documents",
    );

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch credentials" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const body = await req.json();
    console.log("body: ", body);
    const {
      licenseNo,
      licenseState,
      licenseExpiration,
      boardNameOfCertification,
      medicalSchool,
      residencyProgram,
    } = body;

    const updateData: any = {};
    if (licenseNo !== undefined) updateData.licenseNo = licenseNo;
    if (licenseState !== undefined) updateData.licenseState = licenseState;
    if (licenseExpiration !== undefined)
      updateData.licenseExpiration = licenseExpiration;
    if (medicalSchool !== undefined) updateData.medicalSchool = medicalSchool;
    if (residencyProgram !== undefined)
      updateData.residencyProgram = residencyProgram;
    if (boardNameOfCertification !== undefined)
      updateData.boardNameOfCertification = boardNameOfCertification;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 },
      );
    }

    await connectDB();

    const updatedProfile = await DoctorProfile.findOneAndUpdate(
      { userId: session.user.id },
      { $set: updateData, isActive: true },
      { new: true },
    );

    console.log("Updated Profile in DB:", updatedProfile);

    return NextResponse.json(
      { message: "Credentials updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update credentials" },
      { status: 500 },
    );
  }
}
