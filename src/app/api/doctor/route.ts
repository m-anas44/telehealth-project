import { authOptions } from "@/lib/auth";
import { DoctorProfile } from "@/models/doctorProfile";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const query = searchParams.get("query") || ""; // New: Get search term
    const skip = (page - 1) * limit;

    const filter = {
      isActive: true,
      $or: [
        { specialization: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } },
      ],
    };

    const [profiles, totalProfiles] = await Promise.all([
      DoctorProfile.find(filter)
        .limit(limit)
        .skip(skip)
        .select("userId specialization experienceYears bio isActive consultationTypes availability clinicalAddress bufferTime consultationDuration")
        .populate("userId", "name image city")
        .lean(),
      DoctorProfile.countDocuments(filter),
    ]);

    return NextResponse.json({
      profiles,
      pagination: {
        total: totalProfiles,
        page,
        totalPages: Math.ceil(totalProfiles / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching doctors" },
      { status: 500 },
    );
  }
}
