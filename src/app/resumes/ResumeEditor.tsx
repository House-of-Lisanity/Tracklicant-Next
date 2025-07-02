"use client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import type { Resume } from "@/lib/types/resume";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  content: string;
  onEdit: (updated: string) => void;
  isEditing?: boolean;
  resumeId?: string;
  existingName?: string;
  onSave?: (updatedResume: Resume) => Promise<void>;
  onRequestName?: () => void;
};

export default function ResumeEditor({
  isOpen,
  onClose,
  onSaveSuccess,
  content,
  onEdit,
  isEditing = false,
  resumeId,
  existingName = "",
  onSave,
  onRequestName,
}: Props) {
  const [parsedText, setParsedText] = useState(content);
  useEffect(() => {
    setParsedText(content);
  }, [isOpen, content]);

  function parseTextToSections(text: string): Resume["sections"] {
    return {
      summary: text.split("\n\n")[0] || "",
      experience: [],
      education: [],
      skills: [],
    };
  }

  const handleSubmit = async () => {
    console.log("handleSubmit called with:", {
      isEditing,
      resumeId,
      hasOnSave: !!onSave,
    });

    if (isEditing && resumeId && onSave) {
      const updatedResume: Resume = {
        _id: resumeId,
        name: existingName,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(), // placeholder
        sections: parseTextToSections(parsedText),
      };

      try {
        await onSave(updatedResume);
        onSaveSuccess();
      } catch (err) {
        console.error("Error updating resume:", err);
      }
      return; // ✅ prevent falling through
    }
    if (onRequestName) {
      onRequestName();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose}>
        <div className="DialogOverlay">
          <DialogPanel className="DialogPanel">
            <div className="DialogHeader">
              <DialogTitle>Parsed Resume Text</DialogTitle>
              <div className="DialogHeaderActions">
                <span>Review your parsed resume below.</span>
                <div>
                  <button onClick={onClose}>Cancel</button>
                  <button onClick={handleSubmit}>Save</button>
                </div>
              </div>
            </div>

            <textarea
              value={parsedText}
              onChange={(e) => {
                setParsedText(e.target.value);
                onEdit(e.target.value);
              }}
              spellCheck={false}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
