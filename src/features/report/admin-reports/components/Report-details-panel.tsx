import { useNavigate } from "react-router-dom";
import { StickyNote, Loader2 } from "lucide-react";
import { STATUSES, type ReportDetailsPanelProps } from "../types/admin-reports.types";

export const ReportDetailsPanel = ({
  report,
  noteText,
  setNoteText,
  actionLoading,
  onClose,
  onUpdateStatus,
  onSaveNote,
}: ReportDetailsPanelProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-80 shrink-0 flex flex-col ml-4 rounded-2xl overflow-y-auto" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
      {/* Header */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: "var(--fg-primary)" }}>{report.subject}</p>
            <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--fg-muted)" }}>
              {report.reporterRole} · {report.category}
            </p>
          </div>
          <button onClick={onClose} className="text-xs px-2 py-1 rounded-lg" style={{ color: "var(--fg-muted)", background: "var(--bg-base)" }}>✕</button>
        </div>
        <button
          onClick={() => navigate(`/admin/reports/${report.id}`)}
          className="mt-3 w-full text-xs py-2 rounded-xl font-medium transition-all"
          style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--border-accent)" }}
        >
          View Full Report →
        </button>
      </div>

      {/* Description */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--fg-muted)" }}>Description</p>
        <p className="text-xs leading-relaxed line-clamp-5" style={{ color: "var(--fg-primary)" }}>{report.description}</p>
      </div>

      {/* Status Config Matrix */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--fg-muted)" }}>Update Status</p>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map(({ value, label, color, bg }) => (
            <button
              key={value}
              disabled={actionLoading || report.status === value}
              onClick={() => onUpdateStatus(value)}
              className="py-1.5 rounded-xl text-[11px] font-semibold transition-all disabled:opacity-50"
              style={{
                background: report.status === value ? bg : "var(--bg-base)",
                color: report.status === value ? color : "var(--fg-muted)",
                border: `1px solid ${report.status === value ? color + "40" : "var(--border-default)"}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Note Area Textbox Submit */}
      <div className="p-5 flex flex-col gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: "var(--fg-muted)" }}>
          <StickyNote size={11} /> Admin Notes
        </p>
        <textarea
          rows={5}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add a response or internal note…"
          className="w-full px-3 py-2.5 rounded-xl text-xs resize-none outline-none"
          style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
        />
        <button
          disabled={actionLoading}
          onClick={onSaveNote}
          className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", color: "#fff", opacity: actionLoading ? 0.7 : 1 }}
        >
          {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <StickyNote size={12} />}
          {actionLoading ? "Saving…" : "Save Note"}
        </button>
      </div>
    </div>
  );
};