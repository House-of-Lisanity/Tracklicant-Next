"use client";
import { useState, useEffect } from "react";
import type { Resume } from "@/lib/types/resume";
import { fetchResumes, uploadResume } from "@/lib/api/resumes";

type Props = {
  onSelect: (resumeId: string) => void;
};

export default function ResumeSelector({ onSelect }: Props) {
  const [mode, setMode] = useState<"existing" | "upload">("existing");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (mode === "existing") {
      fetchResumes().then(setResumes).catch(console.error);
    }
  }, [mode]);

  const handleExistingSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedResumeId(id);
    onSelect(id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;
    setFile(newFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const newResume = await uploadResume(file);
      onSelect(newResume._id);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            name="resumeMode"
            value="existing"
            checked={mode === "existing"}
            onChange={() => setMode("existing")}
          />
          <span>Choose Existing</span>
        </label>
        <label>
          <input
            type="radio"
            name="resumeMode"
            value="upload"
            checked={mode === "upload"}
            onChange={() => setMode("upload")}
          />
          <span>Upload New</span>
        </label>
      </div>

      {mode === "existing" ? (
        <select value={selectedResumeId} onChange={handleExistingSelect}>
          <option value="">-- Select a Resume --</option>
          {resumes.map((resume) => (
            <option key={resume._id} value={resume._id}>
              {resume.name || "Untitled Resume"}
            </option>
          ))}
        </select>
      ) : (
        <div>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
}
