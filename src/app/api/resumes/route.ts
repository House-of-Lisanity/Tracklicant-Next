// src/app/api/resumes/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Resume } from "@/models/Resume"; // make sure model exists with your schema

export async function GET() {
  await connectToDatabase();
  const resumes = await Resume.find();
  return NextResponse.json(resumes);
}

export async function POST(request: Request) {
  await connectToDatabase();
  const data = await request.json();

  try {
    const newResume = await Resume.create(data);
    return NextResponse.json(
      { message: "Resume added successfully!", resume: newResume },
      { status: 201 }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
