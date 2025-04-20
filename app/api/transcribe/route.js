import { NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";
import { nanoid } from "nanoid";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Upload buffer directly to AssemblyAI
    const upload_url = await client.files.upload(buffer);

    // ✅ Transcribe audio
    const transcript = await client.transcripts.transcribe({
      audio: upload_url,
    });

    return NextResponse.json({ text: transcript.text });
  } catch (err) {
    console.error("Transcription error:", err);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
