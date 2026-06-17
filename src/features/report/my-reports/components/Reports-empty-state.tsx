import { Flag } from "lucide-react";
import type { ReportsEmptyStateProps } from "../types/my-reports.types";

export const ReportsEmptyState = ({ onActionClick }: ReportsEmptyStateProps) => (
  <div
    className="flex flex-col items-center gap-4 py-20 rounded-2xl"
    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
  >
    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)" }}>
      <Flag size={22} style={{ color: "#ef4444" }} />
    </div>
    <div className="text-center">
      <p className="font-semibold" style={{ color: "var(--fg-primary)" }}>No reports found</p>
      <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>You haven't submitted any reports yet.</p>
    </div>
    <button
      onClick={onActionClick}
      className="px-4 py-2 rounded-xl text-sm font-semibold"
      style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--border-accent)" }}
    >
      Submit a Report
    </button>
  </div>
);