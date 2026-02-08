import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/db/connectDB";
import { User } from "@/models/user"; 

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { key } = await req.json();
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { image: key } },
      { new: true }
    );

    if (!updatedUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Profile picture updated", image: updatedUser.image }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "DB Update Failed" }, { status: 500 });
  }
}