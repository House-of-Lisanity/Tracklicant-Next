import { Schema, model, models } from "mongoose";
import { Resume as ResumeInterface } from "@/lib/types/resume";

const ResumeSchema = new Schema<ResumeInterface>(
  {
    name: { type: String, required: true },
    sections: {
      summary: String,
      experience: [String],
      education: [String],
      skills: [String],
    },
  },
  { timestamps: true }
);

export const Resume =
  models.Resume || model<ResumeInterface>("Resume", ResumeSchema);
