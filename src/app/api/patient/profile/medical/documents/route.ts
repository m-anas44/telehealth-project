import { authOptions } from "@/lib/auth";
import MedicalHistory from "@/models/medicalHistory";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const patientId = session.user.id;
    const { documents } = await req.json();

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 },
      );
    }

    const newDocuments = documents.map((doc: any) => ({
      name: doc.name,
      category: doc.category,
      key: doc.key,
      fileType: doc.fileType,
      uploadedAt: new Date(),
    }));

    const updatedVault = await MedicalHistory.findOneAndUpdate(
      { patientId },
      {
        $push: {
          documents: { $each: newDocuments },
        },
      },
      { upsert: true, new: true },
    );

    return NextResponse.json(
      {
        message: "Documents updated successfully",
        count: newDocuments.length,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Documents Sync Error:", error);
    return NextResponse.json(
      { error: "Failed to upload documents to vault" },
      { status: 500 },
    );
  }
}
