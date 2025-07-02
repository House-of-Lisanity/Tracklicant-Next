import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { ObjectId } from "mongodb";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const data = await req.json();

  const updated = await Job.findByIdAndUpdate(params.id, data, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const deleted = await Job.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Job deleted successfully!" });
}
