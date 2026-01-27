import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/db/connectDB";
import { DoctorProfile } from "@/models/doctorProfile";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED_TYPES = {
  medicalLicense: "documents.medicalLicense",
  boardCertification: "documents.boardCertification",
  deaCertificate: "documents.deaCertificate",
} as const;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as keyof typeof ALLOWED_TYPES;

    if (!file || !type) {
      return NextResponse.json(
        { message: "File and type are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES[type]) {
      return NextResponse.json(
        { message: "Invalid document type" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await connectDB();

    const folder = `medapp/doctors/${session.user.id}`;
    const result: any = await uploadToCloudinary(
      buffer,
      folder,
      type
    );

    await DoctorProfile.findOneAndUpdate(
      { userId: session.user.id },
      {
        [ALLOWED_TYPES[type]]: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Document uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Upload failed" },
      { status: 500 }
    );
  }
}
