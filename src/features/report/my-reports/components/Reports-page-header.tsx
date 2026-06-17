import { Flag } from "lucide-react";
import type { ReportsPageHeaderProps } from "../types/my-reports.types";

export const ReportsPageHeader = ({ onReportClick }: ReportsPageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <div>
      <h1 className="text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>My Reports</h1>
      <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
        Track the status of issues you've submitted.
      </p>
    </div>
    <button
      id="new-report-btn"
      onClick={onReportClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all self-start sm:self-auto"
      style={{
        background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
        color: "#fff",
      }}
    >
      <Flag size={14} /> Report Issue
    </button>
  </div>
);