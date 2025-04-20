import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { nanoid } from "nanoid";
import { AssemblyAI } from "assemblyai";

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
    const filename = `${nanoid()}.webm`;
    const tempPath = path.join("/tmp", filename);

    // Save to /tmp
    await writeFile(tempPath, buffer);    

    // Upload to AssemblyAI
    const upload_url = await client.files.upload(tempPath);

    // Transcribe
    const transcript = await client.transcripts.transcribe({
      audio: upload_url,
    });

    return NextResponse.json({ text: transcript.text });
  } catch (err) {
    console.error("Whisper error:", err);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
