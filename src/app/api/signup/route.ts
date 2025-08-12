import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password, confirmPassword, userName, firstName, lastName } =
    await req.json();

  if (
    !email ||
    !password ||
    !confirmPassword ||
    !userName ||
    !firstName ||
    !lastName
  ) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  // Check passwords match
  if (password !== confirmPassword) {
    return NextResponse.json(
      { message: "Passwords do not match." },
      { status: 400 }
    );
  }

  // Password strength check
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return NextResponse.json(
      {
        message:
          "Password must be at least 8 characters, include a number and an uppercase letter.",
      },
      { status: 400 }
    );
  }

  // Check if email exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return NextResponse.json(
      { message: "Email already in use." },
      { status: 400 }
    );
  }

  // Check if username exists
  const usernameExists = await User.findOne({ userName });
  if (usernameExists) {
    return NextResponse.json(
      { message: "Username already in use." },
      { status: 400 }
    );
  }

  // Hash and store
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    userName,
    hashedPassword,
    firstName,
    lastName,
  });

  const token = signToken({
    userId: newUser._id.toString(),
    userName: newUser.userName,
  });

  const res = NextResponse.json({ message: "User created." });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
