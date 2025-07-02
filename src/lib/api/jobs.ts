import apiClient from "./apiClient";
import type { Job, ParsedJobInfo } from "@/lib/types/job";

export const fetchJobs = async () => {
  const response = await apiClient.get("/api/jobs");
  return response.data;
};

export const addJob = async (job: Job) => {
  const response = await apiClient.post("/api/jobs", job);
  return response.data;
};

export const updateJob = async (id: string, updatedJob: Omit<Job, "_id">) => {
  const response = await apiClient.put(`/api/jobs/${id}`, updatedJob);
  return response.data;
};

export const deleteJob = async (id: string) => {
  const response = await apiClient.delete(`/api/jobs/${id}`);
  return response.data;
};

export const parseJobLink = async (url: string): Promise<ParsedJobInfo> => {
  const response = await apiClient.post("/api/parse-job", { url });
  const data = response.data;

  if (data.error) {
    throw new Error(data.error);
  }

  return {
    jobTitle: data.title || "",
    company: data.company || "",
  };
};
