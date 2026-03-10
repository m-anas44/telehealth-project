import { runMedicalAgent, transcribeAudio } from "@/lib/ai/ai-service";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
        if (!session?.user) return unauthorized();

    const { audio, mimeType, history } = await req.json();

    const text = await transcribeAudio(audio, mimeType);
    console.log("here we get the trnscribed audio: ", text)
    const response = await runMedicalAgent(text, history, session.user.id);
    console.log("response we got from send ai message: ", response)

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("voice error:", error);
    return NextResponse.json(
      { error: "Voice processing failed" },
      { status: 500 }
    );
  }
}