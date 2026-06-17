import { format, parseISO } from "date-fns";
import type { BookingResponse } from "../../../../services/api/booking.service";
import type { LucideIcon } from "lucide-react";
import type { AvailabilityRule } from "../../../../services/api/availability.service";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  BarElement,
  ArcElement
} from "chart.js";

export const getClientName = (booking: BookingResponse) =>
  typeof booking.userId === "object" && booking.userId !== null
    ? booking.userId.name
    : `Client #${String(booking.userId).slice(-4)}`;

export const getSessionStart = (booking: BookingResponse) =>
  typeof booking.slotId === "object" && booking.slotId.startTime
    ? parseISO(booking.slotId.startTime)
    : parseISO(booking.createdAt);

export const getSessionEnd = (booking: BookingResponse) =>
  typeof booking.slotId === "object" && booking.slotId.endTime
    ? parseISO(booking.slotId.endTime)
    : getSessionStart(booking);

export const formatSessionTime = (booking: BookingResponse) => {
  const start = getSessionStart(booking);
  const end = getSessionEnd(booking);
  return `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;
};

export const isUpcomingStatus = (status: BookingResponse["status"]) =>
  ["accepted", "awaiting_payment", "confirmed"].includes(status);

export const getStatusGroup = (status: BookingResponse["status"]): StatusGroup => {
  if (status === "completed") return "completed";
  if (status === "cancelled" || status === "rejected" || status === "expired") return "cancelled";
  if (status === "no_show") return "missed";
  return "upcoming";
};

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: string;
}

export interface TodayScheduleProps {
  bookings: BookingResponse[];
  onNavigateToSessions: () => void;
  onNavigateToSessionRoom: (id: string) => void;
}

export interface PendingRequestsProps {
  bookings: BookingResponse[];
  actionId: string | null;
  onStatusUpdate: (id: string, status: "awaiting_payment" | "rejected") => void;
}

export interface ActivityItem {
  id: string;
  label: string;
  date: Date;
}

export interface RecentActivityProps {
  activity: ActivityItem[];
}

export interface ClientInsightsProps {
  activeClients: number;
  newClients: number;
  returningClientCount: number;
  completedCount: number;
}

export const DAYS = [
  { label: "Mon", value: "MO" },
  { label: "Tue", value: "TU" },
  { label: "Wed", value: "WE" },
  { label: "Thu", value: "TH" },
  { label: "Fri", value: "FR" },
  { label: "Sat", value: "SA" },
  { label: "Sun", value: "SU" },
];

export interface AvailabilityRuleCardProps {
  rule: AvailabilityRule;
  onDeleteClick: (id: string) => void;
}

export interface AvailabilityModalFormProps {
  title: string;
  setTitle: (val: string) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  selectedDays: string[];
  toggleDay: (day: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, BarElement,ArcElement);

export type Range = "7d" | "30d";

export interface SessionTrendChartProps {
  completedBookings: BookingResponse[];
  getSessionStart: (booking: BookingResponse) => Date;
}

export const money = (value: number) => `$${Math.round(value).toLocaleString()}`;

export interface EarningsChartProps {
  earningsTrend: { label: string; value: number }[];
  thisMonthCredits: number;
  thisYearCredits: number;
  availableBalance: number;
  pendingPayouts: number;
  totalWithdrawn: number;
  totalRefunds: number;
}


export type StatusGroup = "completed" | "upcoming" | "cancelled" | "missed";

export const STATUS_LABELS: Record<StatusGroup, string> = {
  completed: "Completed",
  upcoming: "Upcoming",
  cancelled: "Cancelled",
  missed: "Missed",
};

export const STATUS_COLORS: Record<StatusGroup, { fill: string; border: string }> = {
  completed: { fill: "#1D9E75", border: "#0F6E56" },
  upcoming: { fill: "#378ADD", border: "#185FA5" },
  cancelled: { fill: "#E24B4A", border: "#A32D2D" },
  missed: { fill: "#BA7517", border: "#854F0B" },
};

export const STATUS_ORDER: StatusGroup[] = ["completed", "upcoming", "cancelled", "missed"];

export interface StatusDistributionChartProps {
  values: Record<StatusGroup, number>;
}



