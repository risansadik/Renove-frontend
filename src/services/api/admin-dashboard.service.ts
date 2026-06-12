import apiClient from "./client.ts";
import type { ApiResponse } from "../../domain/model/index.ts";

export interface AdminDashboardData {
  kpis: {
    totalUsers: number;
    totalTherapists: number;
    totalSessions: number;
    todaysSessions: number;
    activeSessions: number;
    totalRevenue: number;
    monthlyRevenue: number;
    pendingProfileReviews: number;
  };
  sessionsTrend: { label: string; date: string; booked: number; completed: number }[];
  revenueTrend: { label: string; revenue: number }[];
  sessionStatusDistribution: { completed: number; upcoming: number; cancelled: number; missed: number };
  pendingActions: {
    profileApprovals: number;
    userReports: number;
    refundRequests: number;
    verificationRequests: number;
    unresolvedSupportIssues: number;
  };
  recentActivity: { id: string; type: string; message: string; createdAt: string }[];
  therapistPerformance: {
    therapistId: string;
    name: string;
    completedSessions: number;
    averageRating: number;
    totalRatings: number;
    retentionRate: number;
  }[];
  growthSummary: {
    newUsersThisMonth: number;
    newTherapistsThisMonth: number;
    userGrowthPercent: number;
    therapistGrowthPercent: number;
  };
  financialSummary: {
    totalRevenue: number;
    monthlyRevenue: number;
    pendingTherapistPayouts: number;
    completedPayouts: number;
    successfulTransactionCount: number;
  };
  systemHealth: { label: string; status: "operational" | "degraded" | "offline" }[];
}

export const adminDashboardService = {
  getDashboard: async () => {
    const { data } = await apiClient.get<ApiResponse<AdminDashboardData>>("/api/admin/dashboard");
    return data;
  },
};
