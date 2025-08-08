import { useState } from "react";
import JobInputForm from "./JobInputForm";
import { addJob } from "@/lib/api/jobs";
import normalizeJob from "@/lib/utils/normalizeJob";
import { Job } from "@/lib/types/job";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

type AddJobProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddJob({ isOpen, onSuccess, onClose }: AddJobProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  if (!isOpen) return null;

  const postJob = async (newJob: Job, reset: () => void) => {
    try {
      const jobToSend = normalizeJob(newJob);
      await addJob(jobToSend);
      // setMessage("✅ Job saved successfully!");
      // setMessageType("success");
      reset();
      onSuccess();
      onClose();
      console.log("✅ Job saved:", jobToSend);
    } catch (err) {
      setMessage("❌ Something went wrong. Please try again.");
      setMessageType("error");
      console.error("❌ Error saving job:", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="DialogOverlay">
        <DialogPanel className="DialogPanel">
          <DialogTitle>Add a New Job</DialogTitle>
          <p>
            Just drop in the job link. We’ll help with the basics, and you can
            update anything along the way.
          </p>
          <p>
            <span>*</span> = Required field
          </p>

          <JobInputForm onSubmit={postJob} onCancel={onClose} />
          {message && (
            <div
              className={`${
                messageType === "success" ? "DialogSuccess" : "DialogError"
              }`}
            >
              {message}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
