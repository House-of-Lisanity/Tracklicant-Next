"use client";
import type { Resume } from "@/lib/types/resume";
import { useState } from "react";
import ResumeEditor from "@/app/resumes/ResumeEditor";
import { getReadableResumeText } from "@/lib/utils/resumeHelpers";

type Props = {
  resume: Resume;
  onDelete: (id: string) => void;
  onSave: (updatedResume: Resume) => Promise<void>;
};

export default function ResumeCard({ resume, onDelete, onSave }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [parsedText, setParsedText] = useState(getReadableResumeText(resume));

  const handleEdit = (_id: string) => {
    setIsOpen(true);
  };

  return (
    <div className="card-row">
      <div className="card-info">
        <div className="card-title">{resume.name}</div>
        <div className="card-subtitle">
          Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
        </div>
        <div className="card-actions-inline">
          <button
            className="btn-secondary"
            onClick={() => handleEdit(resume._id)}
          >
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

      {isOpen && (
        <ResumeEditor
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSaveSuccess={() => setIsOpen(false)}
          content={parsedText}
          onEdit={(updated) => setParsedText(updated)}
          isEditing={true}
          resumeId={resume._id}
          existingName={resume.name}
          onSave={onSave}
        />
      )}
    </div>
  );
}
