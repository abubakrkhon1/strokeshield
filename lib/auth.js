import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export const signJwt = (data) =>
  jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });

export const setTokenCookie = (token) => {
  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
};

export const getUserFromToken = async () => {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.decode(token);

    const client = await clientPromise;
    const db = client.db("strokeshield");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(decoded.id) });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  } catch (error) {
    return null;
  }
};
