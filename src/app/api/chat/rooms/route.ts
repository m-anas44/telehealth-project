import { authOptions } from "@/lib/auth";
import { Room } from "@/models/room";
import { Chat } from "@/models/chat";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

// return rooms belonging to currently authenticated user (patient or doctor)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    await connectDB();

    const userId = session.user.id;
    const role = session.user.role;

    let filter: any = {};
    if (role === "patient") {
      filter.patientId = userId;
    } else if (role === "doctor") {
      filter.doctorId = userId;
    } else {
      return NextResponse.json({ rooms: [] });
    }

    const rooms = await Room.find(filter)
      .populate("doctorId", "name image")
      .populate("patientId", "name image")
      .lean();

    // attach last message for each room
    const enriched = await Promise.all(
      rooms.map(async (r: any) => {
        const last = await Chat.findOne({ roomId: r._id })
          .sort({ createdAt: -1 })
          .lean();
        return {
          id: r._id,
          appointmentId: r.appointmentId,
          doctor: r.doctorId,
          patient: r.patientId,
          lastMessage: last ? (last as any).content : "",
          lastSenderId: last ? (last as any).senderId : null,
          lastTimestamp: last ? (last as any).createdAt : null,
        };
      }),
    );

    return NextResponse.json({ rooms: enriched });
  } catch (error) {
    console.error("chat rooms error", error);
    return NextResponse.json(
      { message: "Error fetching chat rooms" },
      { status: 500 },
    );
  }
}
