import apiClient from "./apiClient";
import type { UserProfile } from "@/lib/types/user";

export const fetchUserProfile = async () => {
  const response = await apiClient.get("/api/users/profile");
  return response.data;
};

export const updateUserProfile = async (user: Partial<UserProfile>) => {
  const response = await apiClient.put("/api/users/profile", user);
  return response.data;
};
