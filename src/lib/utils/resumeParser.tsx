export type StructuredResume = {
  summary: string;
  experience: string[];
  education: string[];
  skills: string[];
};

export function parseResumeToFields(raw: string): StructuredResume {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const structured: StructuredResume = {
    summary: "",
    experience: [],
    education: [],
    skills: [],
  };

  let currentSection: keyof StructuredResume | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes("experience")) {
      currentSection = "experience";
      continue;
    } else if (lower.includes("education")) {
      currentSection = "education";
      continue;
    } else if (lower.includes("skills")) {
      currentSection = "skills";
      continue;
    }

    if (!currentSection && !structured.summary) {
      structured.summary = line;
    } else if (currentSection) {
      structured[currentSection].push(line);
    }
  }

  return structured;
}
