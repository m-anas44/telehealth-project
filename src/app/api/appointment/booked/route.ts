import { Appointment } from "@/models/appointment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");

    const startOfDay = new Date(date!);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date!);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId,
      time: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["pending", "confirmed"] },
    }).select("time");

    const bookedTimes = appointments.map((app) =>
      app.time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    );

    return NextResponse.json({ bookedTimes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching appintments" },
      { status: 500 },
    );
  }
}
