import type { Report, ReportCategory, ReportStatus } from "../../../../services/api/report.service";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

export interface ReportDetailsPanelProps {
  report: Report;
  noteText: string;
  setNoteText: (val: string) => void;
  actionLoading: boolean;
  onClose: () => void;
  onUpdateStatus: (status: ReportStatus) => void;
  onSaveNote: () => void;
}

export const CATEGORIES: ReportCategory[] = [
  "Technical Issue", "Payment Issue", "Session Issue", "Account Issue",
  "Therapist Complaint", "User Complaint", "Feature Request", "Other",
];

export interface ReportsFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: ReportCategory | "") => void;
}

export const STATUSES = [
  { value: "open" as ReportStatus, label: "Open", color: "#6366f1", bg: "rgba(99,102,241,0.1)", icon: AlertCircle },
  { value: "in_review" as ReportStatus, label: "In Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
  { value: "resolved" as ReportStatus, label: "Resolved", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: CheckCircle2 },
  { value: "rejected" as ReportStatus, label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
];

export interface ReportsHeaderProps {
  total: number;
  reports: Report[];
  filterStatus: string;
  setFilterStatus: (status: ReportStatus | "") => void;
  onRefresh: () => void;
}

export const CATEGORY_COLOR: Record<string, string> = {
  "Technical Issue": "#6366f1", "Payment Issue": "#f59e0b", "Session Issue": "#14b8a6",
  "Account Issue": "#8b5cf6", "Therapist Complaint": "#ef4444", "User Complaint": "#f97316",
  "Feature Request": "#22c55e", "Other": "#94a3b8",
};

export interface ReportsListTableProps {
  loading: boolean;
  filteredReports: Report[];
  selectedReport: Report | null;
  onSelect: (report: Report) => void;
}