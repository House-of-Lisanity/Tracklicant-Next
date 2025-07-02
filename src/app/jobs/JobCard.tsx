import type { Job } from "@/lib/types/job";

type JobCardProps = {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
};

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  return (
    <div className="card-row">
      <div className="card-info">
        <div className="card-title">{job.jobTitle}</div>
        <div className="card-subtitle">{job.company}</div>
        {job.postingLink && (
          <a
            href={job.postingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
          >
            View Posting →
          </a>
        )}
      </div>

      <div className="card-meta">
        <div>Status: {job.status || "—"}</div>
        <div>Applied: {job.appliedDate || "—"}</div>
        <div>Resume: {job.resumeVersion || "—"}</div>
      </div>

      <div className="card-actions">
        <button className="btn-secondary" onClick={onEdit}>
          Update
        </button>
        <button className="btn-secondary" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
