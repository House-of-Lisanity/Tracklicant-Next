export interface Job {
  _id?: string;
  userId?: string; // Optional for frontend use, required in backend
  jobTitle: string;
  company: string;
  postingLink?: string;
  status?: string;
  appliedDate?: string;
  rejectedDate?: string;
  resumeVersion?: string;
  notes?: string;
}

// ----- Ref / component interaction (JobLibrary) -----
export interface JobLibraryHandle {
  refresh: () => void;
}
export type ParsedJobInfo = {
  jobTitle: string;
  company: string;
};

// ----- Optional frontend enhancements (example) -----
export type JobWithStatusLabel = Job & {
  statusLabel: string; // e.g. "Applied 2 weeks ago"
};
