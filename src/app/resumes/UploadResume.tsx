"use client";
import { useState, ChangeEvent, useRef } from "react";

type UploadResumeProps = {
  onFileSelect: (file: File) => void;
};

export default function UploadResume({ onFileSelect }: UploadResumeProps) {
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setFileName(file.name);
    }
  };

  return (
    <div>
      <button className="btn-secondary" type="button" onClick={handleClick}>
        Upload Resume
      </button>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleChange}
        ref={inputRef}
        style={{ display: "none" }}
      />

      {fileName && (
        <p>
          Selected file: <span>{fileName}</span>
        </p>
      )}
    </div>
  );
}
