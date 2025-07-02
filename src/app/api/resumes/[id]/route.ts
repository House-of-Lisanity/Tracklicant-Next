import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const data = await req.json();

  const updated = await Resume.findByIdAndUpdate(params.id, data, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const deleted = await Resume.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Resume deleted successfully!" });
}
