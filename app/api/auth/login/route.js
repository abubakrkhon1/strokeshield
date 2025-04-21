import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setTokenCookie, signJwt, signToken } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  const client = await clientPromise;
  const db = client.db("strokeshield");

  const user = await db.collection("users").findOne({ email });

  if (!user)
    return NextResponse.json({ message: "User not found!", status: 404 });

  console.log(user.password)
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return NextResponse.json({ message: "Invalid password!", status: 401 });

  const token = signJwt({ id: user._id.toString() });

  console.log(token);

  setTokenCookie(token);

  return NextResponse.json({ message: "Login successful", status: 200 });
}
