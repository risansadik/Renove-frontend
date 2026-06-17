import type { ReportStatus } from "../../../../services/api/report.service";
import { AlertCircle, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

export const STATUS_STYLE: Record<ReportStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  open:      { label: "Open",      color: "#6366f1", bg: "rgba(99,102,241,0.1)",  icon: AlertCircle   },
  in_review: { label: "In Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: RefreshCw     },
  resolved:  { label: "Resolved",  color: "#22c55e", bg: "rgba(34,197,94,0.1)",   icon: CheckCircle2  },
  rejected:  { label: "Rejected",  color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: XCircle       },
};

export interface ReportStatusBannerProps {
  status: ReportStatus;
  updatedAt: string | Date;
}

export const CATEGORY_COLOR: Record<string, { color: string; bg: string }> = {
  "Technical Issue":     { color: "#6366f1", bg: "rgba(99,102,241,0.1)"  },
  "Payment Issue":       { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  "Session Issue":       { color: "#14b8a6", bg: "rgba(20,184,166,0.1)"  },
  "Account Issue":       { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)"  },
  "Therapist Complaint": { color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  "User Complaint":      { color: "#f97316", bg: "rgba(249,115,22,0.1)"  },
  "Feature Request":     { color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  "Other":               { color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

export interface ReportDetailsHeaderProps {
  category: string;
  reporterRole: string;
  subject: string;
  createdAt: string | Date;
}

export interface ReportAttachmentsProps {
  attachments: string[];
}

export interface ReportAdminResponseProps {
  adminNotes: string | null | undefined;
}

export interface ReportDetailsPageProps {
  backPath: string;
}