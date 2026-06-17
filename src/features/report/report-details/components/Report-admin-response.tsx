import { MessageSquare, Flag } from "lucide-react";
import type { ReportAdminResponseProps } from "../types/report-details.types";

export const ReportAdminResponse = ({ adminNotes }: ReportAdminResponseProps) => (
  <>
    {adminNotes ? (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={14} style={{ color: "var(--accent-primary)" }} />
          <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-muted)" }}>
            Admin Response
          </h2>
        </div>
        <div
          className="p-4 rounded-xl text-sm leading-relaxed"
          style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)", color: "var(--fg-primary)" }}
        >
          {adminNotes}
        </div>
      </div>
    ) : (
      <div className="p-6 flex items-center gap-3">
        <Flag size={14} style={{ color: "var(--fg-muted)" }} />
        <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
          Our team is reviewing your report. We'll update you here once there's a response.
        </p>
      </div>
    )}
  </>
);