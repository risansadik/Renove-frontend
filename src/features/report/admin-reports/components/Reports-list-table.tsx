import { Flag, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { CATEGORY_COLOR, STATUSES, type ReportsListTableProps } from "../types/admin-reports.types";

export const ReportsListTable = ({ loading, filteredReports, selectedReport, onSelect }: ReportsListTableProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "var(--bg-subtle)" }} />
        ))}
      </div>
    );
  }

  if (filteredReports.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 rounded-2xl" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
        <Flag size={28} style={{ color: "var(--fg-muted)" }} />
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>No reports found for the current filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {filteredReports.map((report) => {
        const st = STATUSES.find((s) => s.value === report.status)!;
        const StatusIcon = st.icon;
        const isSelected = selectedReport?.id === report.id;
        
        return (
          <div
            key={report.id}
            onClick={() => onSelect(report)}
            className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all"
            style={{
              background: isSelected ? "var(--accent-glow)" : "var(--bg-subtle)",
              border: `1px solid ${isSelected ? "var(--border-accent)" : "var(--border-default)"}`,
            }}
          >
            <StatusIcon size={14} style={{ color: st.color, flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--fg-primary)" }}>{report.subject}</p>
              <p className="text-xs truncate mt-0.5 flex items-center gap-1.5" style={{ color: "var(--fg-muted)" }}>
                <span style={{ color: CATEGORY_COLOR[report.category] }}>{report.category}</span>
                <span>·</span>
                <span className="capitalize">{report.reporterRole}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ color: st.color, background: st.bg }}>
                {st.label}
              </span>
              <span className="text-[10px]" style={{ color: "var(--fg-muted)" }}>
                {format(new Date(report.createdAt), "MMM d")}
              </span>
            </div>
            <ChevronRight size={14} style={{ color: "var(--fg-muted)", flexShrink: 0 }} />
          </div>
        );
      })}
    </div>
  );
};