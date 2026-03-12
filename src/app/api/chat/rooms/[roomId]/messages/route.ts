import { authOptions } from "@/lib/auth";
import { Chat } from "@/models/chat";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import mongoose from "mongoose";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    await connectDB();

    const { roomId } = req.nextUrl.pathname.match(/rooms\/(.+?)\/messages/)?.[1]
      ? { roomId: req.nextUrl.pathname.match(/rooms\/(.+?)\/messages/)![1] }
      : { roomId: null };

    if (!roomId || !mongoose.isValidObjectId(roomId)) {
      return NextResponse.json({ message: "Invalid roomId" }, { status: 400 });
    }

    const messages = await Chat.find({ roomId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("chat messages error", error);
    return NextResponse.json(
      { message: "Error fetching chat messages" },
      { status: 500 },
    );
  }
}

// fallback POST endpoint for sending/saving message (used by http fallback)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    await connectDB();

    const { roomId } = req.nextUrl.pathname.match(/rooms\/(.+?)\/messages/)?.[1]
      ? { roomId: req.nextUrl.pathname.match(/rooms\/(.+?)\/messages/)![1] }
      : { roomId: null };

    if (!roomId || !mongoose.isValidObjectId(roomId)) {
      return NextResponse.json({ message: "Invalid roomId" }, { status: 400 });
    }

    const body = await req.json();
    const { content, type } = body;
    if (!content) {
      return NextResponse.json({ message: "Content required" }, { status: 400 });
    }

    const chat = await Chat.create({
      roomId,
      content,
      senderId: session.user.id,
      type: type || "text",
    });

    return NextResponse.json({ message: "Message saved", chat });
  } catch (error) {
    console.error("chat message post error", error);
    return NextResponse.json(
      { message: "Error saving message" },
      { status: 500 },
    );
  }
}
