import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Replace with your own secret in production
const SECRET_KEY = process.env.JWT_SECRET || "tracklicant_dev_secret";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // 🔐 Replace with real credential check later
  if (email !== "user@example.com" || password !== "password123") {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // ✅ Dynamically import the sign function from jsonwebtoken
  const { sign } = await import("jsonwebtoken");

  // 🧾 Create the JWT
  const token = sign({ email }, SECRET_KEY, { expiresIn: "1h" });

  const res = NextResponse.json({ message: "Login successful" });

  // 🍪 Set secure HttpOnly cookie
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}
