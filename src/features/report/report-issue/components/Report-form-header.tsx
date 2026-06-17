import { Flag } from "lucide-react";
import type { ReportFormHeaderProps } from "../types/report-issue.types";

export const ReportFormHeader = ({ reporterContext }: ReportFormHeaderProps) => (
  <div className="flex items-center gap-3 mb-8">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
    >
      <Flag size={18} style={{ color: "#ef4444" }} />
    </div>
    <div>
      <h1 className="text-xl font-bold" style={{ color: "var(--fg-primary)" }}>
        Report an Issue
      </h1>
      <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
        {reporterContext === "therapist"
          ? "Submit a concern or feedback as a therapist."
          : "Tell us what's wrong and we'll make it right."}
      </p>
    </div>
  </div>
);