import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { STATUS_STYLE, type ReportRowCardProps } from "../types/my-reports.types";

export const ReportRowCard = ({ report, onClick }: ReportRowCardProps) => {
  const st = STATUS_STYLE[report.status];
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all group"
      style={{
        background: "var(--bg-subtle)",
        border: "1px solid var(--border-default)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)"; }}
    >
      {/* Status dot */}
      <div className="shrink-0 w-2.5 h-2.5 rounded-full mt-1" style={{ background: st.dot }} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--fg-primary)" }}>{report.subject}</p>
        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--fg-muted)" }}>{report.category}</p>
      </div>

      {/* Status badge */}
      <span
        className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
        style={{ color: st.color, background: st.bg }}
      >
        {st.label}
      </span>

      {/* Date */}
      <span className="text-[11px] shrink-0 hidden sm:block" style={{ color: "var(--fg-muted)" }}>
        {format(new Date(report.createdAt), "MMM d, yyyy")}
      </span>

      <ChevronRight size={14} style={{ color: "var(--fg-muted)" }} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
    </div>
  );
};