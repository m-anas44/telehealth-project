import { authOptions } from "@/lib/auth";
import { Appointment } from "@/models/appointment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const body = await req.json();
    const userId = session?.user.id;

    await Appointment.create({
      ...body,
      status: "pending",
      patientId: userId,
    });

    return NextResponse.json(
      {
        message: "Appointment created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error in creating appointment: ", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
