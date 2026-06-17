import type { ReportCategory } from "../../../../services/api/report.service";

export interface ReportFormHeaderProps {
  reporterContext: "user" | "therapist";
}

export interface ReportFileAttachmentProps {
  files: File[];
  onRemove: (idx: number) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ReportFormSuccessProps {
  onViewReports: () => void;
  onSubmitAnother: () => void;
}

export const CATEGORIES: ReportCategory[] = [
  "Technical Issue",
  "Payment Issue",
  "Session Issue",
  "Account Issue",
  "Therapist Complaint",
  "User Complaint",
  "Feature Request",
  "Other",
];

export const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  "Technical Issue":     { label: "Technical Issue",    color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
  "Payment Issue":       { label: "Payment Issue",      color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  "Session Issue":       { label: "Session Issue",      color: "#14b8a6", bg: "rgba(20,184,166,0.1)"  },
  "Account Issue":       { label: "Account Issue",      color: "#8b5cf6", bg: "rgba(139,92,246,0.1)"  },
  "Therapist Complaint": { label: "Therapist Complaint",color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  "User Complaint":      { label: "User Complaint",     color: "#f97316", bg: "rgba(249,115,22,0.1)"  },
  "Feature Request":     { label: "Feature Request",    color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  "Other":               { label: "Other",              color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
};

export interface ReportFormProps {
  reporterContext?: "user" | "therapist";
}
