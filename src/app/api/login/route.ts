import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { userName, password } = await req.json();
  const normalizedUserName =
    typeof userName === "string" ? userName.trim() : "";

  if (!userName || !password) {
    return NextResponse.json(
      { message: "Username and password required." },
      { status: 400 }
    );
  }

  const user = await User.findOne({ userName: normalizedUserName });
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  }

  const token = signToken({ userId: user._id.toString(), userName });

  const res = NextResponse.json({ message: "Logged in." });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
