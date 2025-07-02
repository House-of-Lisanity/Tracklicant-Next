import { Job } from "../types/job";

const normalizeJob = (job: Job): Job => {
  const today = new Date().toISOString().split("T")[0];
  return {
    ...job,
    appliedDate:
      job.status === "applied" && !job.appliedDate ? today : job.appliedDate,
    rejectedDate:
      job.status === "rejected" && !job.rejectedDate ? today : job.rejectedDate,
    postingLink: job.postingLink?.startsWith("http")
      ? job.postingLink
      : `https://${job.postingLink?.trim()}`,
  };
};

export default normalizeJob;
