import { Schema, model, models } from "mongoose";
import type { Job as JobInterface } from "@/lib/types/job";

const JobSchema = new Schema<JobInterface>(
  {
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    postingLink: String,
    status: String,
    appliedDate: String,
    rejectedDate: String,
    resumeVersion: String,
    notes: String,
  },
  { timestamps: true }
);

export const Job = models.Job || model<JobInterface>("Job", JobSchema);
