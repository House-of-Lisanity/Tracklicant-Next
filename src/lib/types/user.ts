export interface EducationEntry {
  degree: string;
  school: string;
  graduationDate?: string;
}

export interface UserProfile {
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  education: EducationEntry[];
  masterSkills?: string[];
}

// ----- Optional UI-only user model -----
export type UserProfileWithResumeCount = UserProfile & {
  resumeCount: number;
};
