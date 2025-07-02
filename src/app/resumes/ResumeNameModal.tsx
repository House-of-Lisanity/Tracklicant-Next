"use client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

type ResumeNameModalProps = {
  isOpen: boolean;
  resumeName: string;
  setResumeName: (name: string) => void;
  onConfirm: (name: string) => void;
  onCancel: () => void;
};

export default function ResumeNameModal({
  isOpen,
  resumeName,
  setResumeName,
  onConfirm,
  onCancel,
}: ResumeNameModalProps) {
  const handleSubmit = () => {
    if (resumeName.trim()) {
      onConfirm(resumeName.trim());
    }
  };

  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <div className="DialogOverlay">
        <DialogPanel className="DialogPanel">
          <DialogTitle>Name Your Resume</DialogTitle>
          <input
            type="text"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder="e.g. 'Marketing Resume – May 2025'"
          />
          <div>
            <button onClick={onCancel}>Cancel</button>
            <button onClick={handleSubmit}>Save</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
