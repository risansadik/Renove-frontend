import apiClient from "./client";
import type { ApiResponse } from "../../domain/model/index";

export type ReportStatus = "open" | "in_review" | "resolved" | "rejected";
export type ReportCategory =
  | "Technical Issue"
  | "Payment Issue"
  | "Session Issue"
  | "Account Issue"
  | "Therapist Complaint"
  | "User Complaint"
  | "Feature Request"
  | "Other";

export interface Report {
  id: string;
  reporterId: string;
  reporterRole: "user" | "therapist";
  category: ReportCategory;
  subject: string;
  description: string;
  attachments: string[];
  status: ReportStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportListResponse {
  data: Report[];
  total: number;
}

export interface CreateReportPayload {
  category: ReportCategory;
  subject: string;
  description: string;
  attachments?: File[];
}

const reportService = {
  createReport: async (payload: CreateReportPayload): Promise<ApiResponse<Report>> => {
    const formData = new FormData();
    formData.append("category", payload.category);
    formData.append("subject", payload.subject);
    formData.append("description", payload.description);
    if (payload.attachments) {
      payload.attachments.forEach((file) => formData.append("attachments", file));
    }
    const res = await apiClient.post<ApiResponse<Report>>("/api/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  getMyReports: async (page = 1, limit = 10): Promise<ApiResponse<ReportListResponse>> => {
    const res = await apiClient.get<ApiResponse<ReportListResponse>>(
      `/api/reports/my?page=${page}&limit=${limit}`
    );
    return res.data;
  },

  getReportDetails: async (id: string): Promise<ApiResponse<Report>> => {
    const res = await apiClient.get<ApiResponse<Report>>(`/api/reports/${id}`);
    return res.data;
  },

  adminGetAllReports: async (
    page = 1,
    limit = 10,
    filters?: { status?: ReportStatus; category?: ReportCategory }
  ): Promise<ApiResponse<ReportListResponse>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    const res = await apiClient.get<ApiResponse<ReportListResponse>>(
      `/api/reports/admin/all?${params.toString()}`
    );
    return res.data;
  },

  adminUpdateStatus: async (id: string, status: ReportStatus): Promise<ApiResponse<Report>> => {
    const res = await apiClient.patch<ApiResponse<Report>>(`/api/reports/admin/${id}/status`, { status });
    return res.data;
  },

  adminAddNote: async (id: string, adminNotes: string): Promise<ApiResponse<Report>> => {
    const res = await apiClient.patch<ApiResponse<Report>>(`/api/reports/admin/${id}/notes`, { adminNotes });
    return res.data;
  },
};

export default reportService;
