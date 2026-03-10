import { authOptions } from "@/lib/auth";
import { getDownloadPresignedURL } from "@/lib/s3-wrapper";
import MedicalHistory from "@/models/medicalHistory";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const userId = session.user.id;

    const record = await MedicalHistory.findOne({ patientId: userId })
      .select("documents")
      .lean();

    if (!record) {
      return NextResponse.json(
        { message: "No records found", data: null },
        { status: 200 },
      );
    }

    const documentsWithUrls = await Promise.all(
      (record.documents || []).map(async (doc: any) => ({
        ...doc,
        url: await getDownloadPresignedURL(doc.key),
      })),
    );

    // Categorize documents
    const categorized = {
      reports: documentsWithUrls.filter(
        (doc: any) => doc.category === "report",
      ),
      xrays: documentsWithUrls.filter((doc: any) => doc.category === "xray"),
      prescriptions: documentsWithUrls.filter(
        (doc: any) => doc.category === "prescription",
      ),
      other: documentsWithUrls.filter((doc: any) => doc.category === "other"),
    };

    return NextResponse.json(
      {
        message: "Medical history fetched successfully",
        data: categorized,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetching medical history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical history" },
      { status: 500 },
    );
  }
}
