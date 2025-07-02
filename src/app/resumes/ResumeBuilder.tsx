"use client";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import UploadResume from "@/app/resumes/UploadResume";
import mammoth from "mammoth";

type ResumeBuilderProps = {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (parsedData: {
    summary?: string;
    experience?: string[];
    education?: string[];
    skills?: string[];
  }) => void;
  onSuccess?: () => void;
};

export default function ResumeBuilder({
  isOpen,
  onClose,
  onParsed,
}: ResumeBuilderProps) {
  const [file, setFile] = useState<File | null>(null);

  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!file) return;

    setParsing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      setParsing(false);

      // ✅ Call the parent!
      onParsed({
        summary: text,
        experience: [],
        education: [],
        skills: [],
      });

      onClose(); // Close the Builder modal
    } catch (err) {
      console.error("Error parsing file:", err);
      setError("Failed to parse the file.");
      setParsing(false);
    }
  };

  const handleCloseAndReset = () => {
    setFile(null);

    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="DialogOverlay">
        <DialogPanel className="DialogPanel">
          <DialogTitle>Upload Resume File</DialogTitle>

          <UploadResume
            onFileSelect={(file) => {
              setFile(file);

              setError(null);
            }}
          />
          <div className="DialogActions">
            <button onClick={handleParse} disabled={parsing || !file}>
              {parsing ? "Parsing..." : "Continue to Editor"}
            </button>
            {error && <div className="error-message">{error}</div>}
            <button onClick={handleCloseAndReset}>Cancel</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
