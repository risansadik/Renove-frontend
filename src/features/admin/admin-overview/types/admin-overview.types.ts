import type { AdminDashboardData } from "../../../../services/api/admin-dashboard.service";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

export interface DashboardKpisGridProps {
  dashboard: AdminDashboardData;
  money: (value: number) => string;
}

export interface DashboardOperationsRowProps {
  dashboard: AdminDashboardData;
}

export interface DashboardMetricsRowProps {
  dashboard: AdminDashboardData;
  money: (value: number) => string;
}

export interface DashboardHealthGridProps {
  dashboard: AdminDashboardData;
}

export interface RevenueGrowthChartProps {
  data: { label: string; revenue: number }[];
}

export type Mode = "daily" | "weekly" | "monthly";

export interface SessionsTrendChartProps {
  data: { label: string; booked: number; completed: number }[];
}

export type StatusKey = "completed" | "upcoming" | "cancelled" | "missed";

export const colors: Record<StatusKey, string> = {
  completed: "#10b981",
  upcoming: "#6366f1",
  cancelled: "#ef4444",
  missed: "#f59e0b",
};

export interface Props {
  data: Record<StatusKey, number>;
}

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

export const chartGridColor = "rgba(148, 163, 184, 0.18)";
export const chartTextColor = "rgba(100, 116, 139, 0.9)";



