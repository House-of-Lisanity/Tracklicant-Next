import type { Resume } from "../types/resume";

function hasContentField(obj: unknown): obj is { content: string } {
  return typeof obj === "object" && obj !== null && "content" in obj;
}

export function getReadableResumeText(resume: Resume): string {
  if (hasContentField(resume)) {
    return resume.content;
  }

  return Object.entries(resume.sections || {})
    .map(([, value]) => {
      if (Array.isArray(value)) return value.join("\n");
      return value || "";
    })
    .filter(Boolean)
    .join("\n\n");
}
