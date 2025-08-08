import { Schema, model, models } from "mongoose";
import type { UserProfile as UserInterface } from "@/lib/types/user";

const UserSchema = new Schema<UserInterface>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    phone: String,
    location: String,
    linkedIn: String,
    github: String,
    website: String,
    education: [
      {
        degree: String,
        school: String,
        graduationDate: String,
      },
    ],
    masterSkills: [String],
  },
  { timestamps: true }
);

export const User = models.User || model<UserInterface>("User", UserSchema);
