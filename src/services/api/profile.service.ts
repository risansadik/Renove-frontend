import apiClient from "./client.js";
import type { ApiResponse, User, Therapist, Admin } from "../../domain/model/index.js";

interface PasswordUpdateDto {
  currentPasswordRaw: string;
  newPasswordRaw: string;
}

export const profileService = {
  // ── USER ──
  async getUserProfile(): Promise<ApiResponse<{ user: User }>> {
    const { data } = await apiClient.get("/api/user/profile");
    return data;
  },
  async updateUserProfile(formData: FormData): Promise<ApiResponse<{ user: User }>> {
    const { data } = await apiClient.patch("/api/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  async changeUserPassword(payload: PasswordUpdateDto): Promise<ApiResponse> {
    const { data } = await apiClient.post("/api/user/profile/password", {
      currentPassword: payload.currentPasswordRaw,
      newPassword: payload.newPasswordRaw
    });
    return data;
  },

  // ── THERAPIST ──
  async getTherapistProfile(): Promise<ApiResponse<{ therapist: Therapist }>> {
    const { data } = await apiClient.get("/api/therapist/profile");
    return data;
  },
  async updateTherapistProfile(formData: FormData): Promise<ApiResponse<{ therapist: Therapist }>> {
    const { data } = await apiClient.patch("/api/therapist/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  async changeTherapistPassword(payload: PasswordUpdateDto): Promise<ApiResponse> {
    const { data } = await apiClient.post("/api/therapist/profile/password", {
      currentPassword: payload.currentPasswordRaw,
      newPassword: payload.newPasswordRaw
    });
    return data;
  },

  // ── ADMIN ──
  async getAdminProfile(): Promise<ApiResponse<{ admin: Admin }>> {
    const { data } = await apiClient.get("/api/admin/profile");
    return data;
  },
  async updateAdminProfile(formData: FormData): Promise<ApiResponse<{ admin: Admin }>> {
    const { data } = await apiClient.patch("/api/admin/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  async changeAdminPassword(payload: PasswordUpdateDto): Promise<ApiResponse> {
    const { data } = await apiClient.post("/api/admin/profile/password", {
      currentPassword: payload.currentPasswordRaw,
      newPassword: payload.newPasswordRaw
    });
    return data;
  },

  // ── ADMIN: THERAPIST REVIEW ──
  async getPendingTherapistUpdates(): Promise<ApiResponse<{ therapists: Therapist[] }>> {
    const { data } = await apiClient.get("/api/admin/therapists/pending-updates");
    return data;
  },
  async reviewTherapistUpdate(id: string, payload: { status: "approved" | "rejected"; reason?: string }): Promise<ApiResponse<{ therapist: Therapist }>> {
    const { data } = await apiClient.post(`/api/admin/therapists/${id}/review-update`, payload);
    return data;
  }
};
