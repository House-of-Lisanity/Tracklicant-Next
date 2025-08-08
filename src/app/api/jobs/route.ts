import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { Types } from "mongoose";

// GET /api/jobs
export async function GET() {
  await connectToDatabase();

  // ✅ Check auth
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId;
  try {
    const payload = verifyToken(token);
    userId = payload.userId;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // ✅ Filter jobs by userId
  const jobs = await Job.find({ userId: new Types.ObjectId(userId) }).sort({
    appliedDate: -1,
  });

  return NextResponse.json(jobs);
}

// POST /api/jobs
export async function POST(req: NextRequest) {
  await connectToDatabase();

  // ✅ Check auth
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId;
  try {
    const payload = verifyToken(token);
    userId = payload.userId;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

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
    userId, // ✅ Add userId from token!
    jobTitle: data.jobTitle,
    company: data.company,
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
