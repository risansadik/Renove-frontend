import { CheckCircle2 } from "lucide-react";
import type { ReportFormSuccessProps } from "../types/report-issue.types";

export const ReportFormSuccess = ({ onViewReports, onSubmitAnother }: ReportFormSuccessProps) => (
  <div className="max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-6">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center"
      style={{ background: "rgba(34,197,94,0.12)", border: "1.5px solid rgba(34,197,94,0.3)" }}
    >
      <CheckCircle2 size={38} style={{ color: "#22c55e" }} />
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--fg-primary)" }}>
        Report Submitted!
      </h2>
      <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
        Our team will review your report and respond as soon as possible. You can track
        the status from <strong>My Reports</strong>.
      </p>
    </div>
    <div className="flex gap-3 flex-wrap justify-center">
      <button
        onClick={onViewReports}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--border-accent)" }}
      >
        View My Reports
      </button>
      <button
        onClick={onSubmitAnother}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{ background: "var(--bg-subtle)", color: "var(--fg-muted)", border: "1px solid var(--border-default)" }}
      >
        Submit Another
      </button>
    </div>
  </div>
);