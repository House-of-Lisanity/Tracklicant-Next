export interface NewResume {
  name: string;
  content: string;
}

export interface Resume {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sections: {
    summary?: string;
    experience?: string[];
    education?: string[];
    skills?: string[];
  };
}

export interface ResumeLibraryHandle {
  refresh: () => void;
}

// ----- Optional frontend enhancements -----
export type ResumeWithTags = Resume & {
  keywordMatchScore: number;
  flaggedSkills?: string[];
  rewrittenContent?: string;
};
