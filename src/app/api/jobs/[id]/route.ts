import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Job } from "@/models/Job";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is now a Promise
) {
  await connectToDatabase();
  const data = await req.json();

  // Await the params Promise
  const { id } = await context.params;

  try {
    const updated = await Job.findByIdAndUpdate(id, data, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is now a Promise
) {
  await connectToDatabase();

  // Await the params Promise
  const { id } = await context.params;

  try {
    const deleted = await Job.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job deleted successfully!" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
