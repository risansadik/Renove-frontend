import type { Report, ReportStatus } from "../../../../services/api/report.service";

export const STATUS_STYLE: Record<ReportStatus, { label: string; color: string; bg: string; dot: string }> = {
  open:      { label: "Open",      color: "#6366f1", bg: "rgba(99,102,241,0.1)",  dot: "#6366f1" },
  in_review: { label: "In Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  dot: "#f59e0b" },
  resolved:  { label: "Resolved",  color: "#22c55e", bg: "rgba(34,197,94,0.1)",   dot: "#22c55e" },
  rejected:  { label: "Rejected",  color: "#ef4444", bg: "rgba(239,68,68,0.1)",   dot: "#ef4444" },
};

export interface ReportRowCardProps {
  report: Report;
  onClick: () => void;
}

export interface ReportsEmptyStateProps {
  onActionClick: () => void;
}

export interface ReportsPageHeaderProps {
  onReportClick: () => void;
}

export const STATUS_LABELS: Record<ReportStatus, string> = {
  open: "Open",
  in_review: "In Review",
  resolved: "Resolved",
  rejected: "Rejected",
};

export interface MyReportsPageProps {
  reportPath: string;
  detailBasePath: string;
}
