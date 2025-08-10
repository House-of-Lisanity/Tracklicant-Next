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

  // helper to coerce strings/null into Date|null
  function toDate(v: unknown): Date | null {
    if (!v) return null;
    if (v instanceof Date) return v;
    const d = new Date(String(v));
    return isNaN(d.getTime()) ? null : d;
  }

  function normalizeJobDates(arr: Job[]): Job[] {
    // Keep data as-is; we’ll parse on use so we don’t fight types (string vs Date)
    return arr.map((j) => ({ ...j }));
  }

  const loadJobs = async () => {
    try {
      const data = await fetchJobs();
      setJobs(normalizeJobDates(data));
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

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<
    "all" | "thisWeek" | "lastWeek" | "thisMonth" | "lastMonth"
  >("all");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  const filteredJobs = jobs.filter((job) => {
    // Keyword match
    const keywordMatch = searchTerm
      ? job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.notes &&
          job.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;

    // Date match
    const jobDate = toDate(job.appliedDate);

    let dateMatch = true;

    if (dateFilter !== "all" && jobDate) {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

      const startOfLastWeek = new Date(startOfWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      if (dateFilter === "thisWeek") {
        dateMatch = jobDate >= startOfWeek && jobDate <= endOfWeek;
      } else if (dateFilter === "lastWeek") {
        dateMatch = jobDate >= startOfLastWeek && jobDate <= endOfLastWeek;
      } else if (dateFilter === "thisMonth") {
        dateMatch = jobDate >= startOfMonth;
      } else if (dateFilter === "lastMonth") {
        dateMatch = jobDate >= startOfLastMonth && jobDate <= endOfLastMonth;
      }
    }

    // Custom range override
    if (customStartDate && customEndDate && jobDate) {
      dateMatch = jobDate >= customStartDate && jobDate <= customEndDate;
    }

    return keywordMatch && dateMatch;
  });

  return (
    <div>
      <div>
        <h3>My Jobs</h3>

        {/* Filters */}
        <div className="filters toolbar">
          <div className="filter-search">
            <input
              type="text"
              placeholder="Search by keyword…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Keyword search"
            />
          </div>

          <select
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(
                e.target.value as
                  | "all"
                  | "thisWeek"
                  | "lastWeek"
                  | "thisMonth"
                  | "lastMonth"
              )
            }
            aria-label="Quick date range"
          >
            <option value="all">All Dates</option>
            <option value="thisWeek">This Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
          </select>

          <input
            type="date"
            value={
              customStartDate ? customStartDate.toISOString().slice(0, 10) : ""
            }
            onChange={(e) =>
              setCustomStartDate(
                e.target.value ? new Date(e.target.value) : null
              )
            }
            aria-label="Start date"
          />

          <input
            type="date"
            value={
              customEndDate ? customEndDate.toISOString().slice(0, 10) : ""
            }
            onChange={(e) =>
              setCustomEndDate(e.target.value ? new Date(e.target.value) : null)
            }
            aria-label="End date"
          />
          <button
            type="button"
            className="filter-apply-btn"
            onClick={() => setSearchTerm(searchTerm.trim())}
            aria-label="Apply search"
          >
            ➔
          </button>
        </div>
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

      {filteredJobs.length > 0 ? (
        <div>
          {filteredJobs.map((job) => (
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
        <p>No jobs match your filters.</p>
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
