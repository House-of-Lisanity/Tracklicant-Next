"use client";

import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from "react";
import EditJobModal from "./EditJob";
import JobCard from "./JobCard";
import { scrollToTopIfNeeded } from "@/lib/utils/scrollHelpers";
import { fetchJobs, deleteJob, updateJob } from "@/lib/api/jobs";
import type { Job, JobLibraryHandle } from "@/lib/types/job";

const JobLibrary: ForwardRefRenderFunction<JobLibraryHandle> = (_, ref) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const loadJobs = async () => {
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("❌ Error fetching jobs.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: loadJobs,
  }));

  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job._id !== id));
      scrollToTopIfNeeded();
      setMessage("Job deleted successfully!");
      setMessageType("success");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (err) {
      console.error("❌ DELETE error:", err);
      setMessage("❌ Error deleting job.");
      setMessageType("error");
    }
  };

  const handleUpdate = async (id: string, updatedJob: Job) => {
    const { _id, ...jobWithoutId } = updatedJob;

    try {
      const result = await updateJob(_id!, jobWithoutId);
      setJobs((prev) =>
        prev.map((job) => (job._id === id ? { ...job, ...result } : job))
      );
      setMessage("Job updated successfully!");
      setMessageType("success");
      loadJobs();
    } catch (err) {
      console.error("❌ PUT error:", err);
    }
  };

  return (
    <div>
      <div>
        <h3>My Jobs</h3>
      </div>
      {message && (
        <div
          className={` ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      {jobs.length > 0 ? (
        <div>
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={() => {
                setEditingJob(job);
                setIsModalOpen(true);
              }}
              onDelete={() => job._id && handleDelete(job._id)}
            />
          ))}
        </div>
      ) : (
        <p>No jobs to display yet.</p>
      )}
      <EditJobModal
        isOpen={isModalOpen}
        job={editingJob!}
        onClose={() => setIsModalOpen(false)}
        onSave={(updatedJob) => handleUpdate(updatedJob._id!, updatedJob)}
      />
    </div>
  );
};

export default forwardRef(JobLibrary);
