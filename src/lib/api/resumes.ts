import apiClient from "./apiClient";
import type { Resume, NewResume } from "@/lib/types/resume";

export const fetchResumes = async () => {
  const response = await apiClient.get("/api/resumes");
  return response.data;
};

export const addResume = async (resume: NewResume) => {
  const response = await apiClient.post("/api/resumes", resume);
  return response.data;
};

export const updateResume = async (
  id: string,
  updatedResume: Omit<Resume, "_id">
) => {
  const response = await apiClient.put(`/api/resumes/${id}`, updatedResume);
  return response.data;
};

export const deleteResume = async (id: string) => {
  const response = await apiClient.delete(`/api/resumes/${id}`);
  return response.data;
};

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/api/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
