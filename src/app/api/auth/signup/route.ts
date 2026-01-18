import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/user";
import connectDB from "@/db/connectDB";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "patient",
    });

    return NextResponse.json(
      {
        message: "User registered successfully. Please signin to continue."
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 },
    );
  }
}
