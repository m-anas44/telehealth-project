import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import { DoctorProfile } from "@/models/doctorProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { key, category, fileName } = body;
    if (!key || !category) {
      return NextResponse.json({ message: "Missing key or category" }, { status: 400 });
    }

    await connectDB();
    const userId = session.user.id;

    const profile = await DoctorProfile.findOne({ userId });
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    if (!profile) {
      // create profile and add document
      const data: any = { userId, isActive: true };
      data.documents = {};
      data.documents[category] = { url, publicId: key, fileName };
      await DoctorProfile.create(data);
    } else {
      if (!profile.documents) profile.documents = {} as any;
      (profile as any).documents[category] = { url, publicId: key, fileName };
      await profile.save();
    }

    return NextResponse.json({ message: "Document saved", url }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to save document" }, { status: 500 });
  }
}
