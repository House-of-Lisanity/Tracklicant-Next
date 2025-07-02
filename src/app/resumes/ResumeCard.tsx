"use client";
import type { Resume } from "@/lib/types/resume";
import { getReadableResumeText } from "@/lib/utils/resumeHelpers";

type Props = {
  resume: Resume;
  onDelete: (id: string) => void;
  onEdit?: (text: string, id: string) => void;
  onSave: (updatedResume: Resume) => Promise<void>;
};

export default function ResumeCard({ resume, onEdit, onDelete }: Props) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(getReadableResumeText(resume), resume._id);
    }
  };

  return (
    <div className="card-row">
      <div className="card-info">
        <div className="card-title">{resume.name}</div>
        <div className="card-subtitle">
          Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
        </div>
        <div className="card-actions-inline">
          <button className="btn-secondary" onClick={() => handleEdit()}>
            Edit
          </button>
          <button
            className="btn-secondary"
            onClick={() => alert("Generate ATS Resume")}
          >
            Generate ATS
          </button>
          <button
            className="btn-secondary"
            onClick={() => alert("Download PDF")}
          >
            Download
          </button>
          <button
            className="btn-secondary"
            onClick={() => onDelete(resume._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
