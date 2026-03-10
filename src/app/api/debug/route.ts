// app/api/debug/availability/route.ts
import { NextResponse } from "next/server";
import { getDoctorAvailability } from "@/lib/ai/appointmentToolFunctions";
import connectDB from "@/db/connectDB";

export async function GET() {
  try {
    await connectDB();

    // HARDCODED DATA FOR TESTING
    const testParams = {
      doctorId: "696d08a1015d7e771b311d5c", // Apne DB se ek asli User ID uthayein
      day: "2026-03-11", // Check karein ke is din doctor available hai schedule mein
    };

    const result = await getDoctorAvailability(testParams);

    return NextResponse.json({
      message: "Testing getDoctorAvailability",
      input: testParams,
      output: result
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}