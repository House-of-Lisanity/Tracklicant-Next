import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";

// GET /api/jobs
export async function GET() {
  await connectToDatabase();

  const jobs = await Job.find().sort({ appliedDate: -1 });
  // Remove Mongo _id conversion here if using object mapping, else include .select ...

  return NextResponse.json(jobs);
}

// POST /api/jobs
export async function POST(req: Request) {
  await connectToDatabase();
  const data = await req.json();

  const required = ["jobTitle", "company"];
  const missing = required.filter((f) => !(f in data));
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const created = await Job.create({
    ...data,
    postingLink: data.postingLink || "",
    status: data.status || "",
    appliedDate: data.appliedDate || null,
    rejectedDate: data.rejectedDate || null,
    resumeVersion: data.resumeVersion || "",
    notes: data.notes || "",
  });

  return NextResponse.json(
    { message: "Job added successfully!", job: created },
    { status: 201 }
  );
}
