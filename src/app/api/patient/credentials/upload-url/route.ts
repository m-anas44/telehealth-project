import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getDownloadPresignedURL,
  getUploadPresignedURL,
} from "@/lib/s3-wrapper";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key)
      return NextResponse.json({ message: "Missing key" }, { status: 400 });

    const url = await getDownloadPresignedURL(key);

    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to get view url" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { fileName, fileType, category } = body;
    if (!fileName || !fileType || !category) {
      return NextResponse.json(
        { message: "Missing fileName/fileType/category" },
        { status: 400 },
      );
    }

    const role = "patient" as const;
    const userId = session.user.id;

    const { url, key } = await getUploadPresignedURL(
      role,
      userId,
      category,
      fileName,
      fileType,
    );

    return NextResponse.json({ url, key }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to get upload url" },
      { status: 500 },
    );
  }
}
