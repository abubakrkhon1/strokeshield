import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();

  const client = await clientPromise;
  const db = client.db("strokeshield");

  const user = await db.collection("users").findOne({ email });

  if (!user)
    return NextResponse.json({ message: "User not found!", status: 404 });

  if (!password)
    return NextResponse.json({ message: "User found!", status: 200 });

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .collection("users")
    .updateOne({ email }, { $set: { password: hashedPassword } });

  return NextResponse.json({
    message: "Password successfully updated!",
    status: 200,
  });
}
