import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flag, ChevronRight, Search, RefreshCw, Filter, ChevronDown,
  CheckCircle2, XCircle, AlertCircle, Clock, StickyNote, Loader2
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import reportService, { type Report, type ReportStatus, type ReportCategory } from "../../services/api/report.service";

const STATUSES: { value: ReportStatus; label: string; color: string; bg: string; icon: typeof CheckCircle2 }[] = [
  { value: "open",      label: "Open",      color: "#6366f1", bg: "rgba(99,102,241,0.1)",  icon: AlertCircle  },
  { value: "in_review", label: "In Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: Clock        },
  { value: "resolved",  label: "Resolved",  color: "#22c55e", bg: "rgba(34,197,94,0.1)",   icon: CheckCircle2 },
  { value: "rejected",  label: "Rejected",  color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: XCircle      },
];

const CATEGORIES: ReportCategory[] = [
  "Technical Issue", "Payment Issue", "Session Issue", "Account Issue",
  "Therapist Complaint", "User Complaint", "Feature Request", "Other",
];

const CATEGORY_COLOR: Record<string, string> = {
  "Technical Issue": "#6366f1", "Payment Issue": "#f59e0b", "Session Issue": "#14b8a6",
  "Account Issue": "#8b5cf6", "Therapist Complaint": "#ef4444", "User Complaint": "#f97316",
  "Feature Request": "#22c55e", "Other": "#94a3b8",
};

export const AdminReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "">("");
  const [filterCategory, setFilterCategory] = useState<ReportCategory | "">("");
  const [search, setSearch] = useState("");

  // Selected report for actions
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [noteText, setNoteText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchReports = async (p: number) => {
    setLoading(true);
    try {
      const filters: { status?: ReportStatus; category?: ReportCategory } = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterCategory) filters.category = filterCategory;
      const res = await reportService.adminGetAllReports(p, limit, filters);
      if (res.data) {
        setReports(res.data.data);
        setTotal(res.data.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(page); }, [page, filterStatus, filterCategory]);

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
    setNoteText(report.adminNotes ?? "");
    setShowPanel(true);
  };

  const handleUpdateStatus = async (status: ReportStatus) => {
    if (!selectedReport) return;
    setActionLoading(true);
    try {
      const res = await reportService.adminUpdateStatus(selectedReport.id, status);
      toast.success("Status updated");
      if (res.data) {
        setSelectedReport(res.data);
        setReports((prev) => prev.map((r) => r.id === res.data!.id ? res.data! : r));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedReport) return;
    setActionLoading(true);
    try {
      const res = await reportService.adminAddNote(selectedReport.id, noteText);
      toast.success("Notes saved");
      if (res.data) {
        setSelectedReport(res.data);
        setReports((prev) => prev.map((r) => r.id === res.data!.id ? res.data! : r));
      }
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = search
    ? reports.filter(
        (r) =>
          r.subject.toLowerCase().includes(search.toLowerCase()) ||
          r.category.toLowerCase().includes(search.toLowerCase()) ||
          r.reporterRole.toLowerCase().includes(search.toLowerCase())
      )
    : reports;

  return (
    <div className="flex h-full gap-0" style={{ minHeight: 0 }}>
      {/* Left panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>Reports</h1>
            <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
              {total} total report{total !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => fetchReports(page)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium self-start sm:self-auto"
            style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-muted)" }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map(({ value, label, color, bg, icon: Icon }) => {
            const count = reports.filter((r) => r.status === value).length;
            return (
              <button
                key={value}
                onClick={() => setFilterStatus(filterStatus === value ? "" : value)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: filterStatus === value ? bg : "var(--bg-subtle)",
                  color: filterStatus === value ? color : "var(--fg-muted)",
                  border: `1px solid ${filterStatus === value ? color + "40" : "var(--border-default)"}`,
                }}
              >
                <Icon size={11} /> {label} · {count}
              </button>
            );
          })}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-muted)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports…"
              className="w-full pl-8 pr-4 py-2 rounded-xl text-xs outline-none"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
            />
          </div>
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-muted)" }} />
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value as ReportCategory | ""); setPage(1); }}
              className="appearance-none pl-8 pr-8 py-2 rounded-xl text-xs font-medium outline-none"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-muted)" }} />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: "var(--bg-subtle)" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 rounded-2xl" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
            <Flag size={28} style={{ color: "var(--fg-muted)" }} />
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>No reports found for the current filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((report) => {
              const st = STATUSES.find((s) => s.value === report.status)!;
              const StatusIcon = st.icon;
              const isSelected = selectedReport?.id === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => handleSelectReport(report)}
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
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
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
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <span className="text-xs" style={{ color: "var(--fg-muted)" }}>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl text-xs font-medium disabled:opacity-40"
                style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}>
                Previous
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl text-xs font-medium disabled:opacity-40"
                style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right panel: detail & actions */}
      {showPanel && selectedReport && (
        <div
          className="w-80 flex-shrink-0 flex flex-col ml-4 rounded-2xl overflow-y-auto"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
        >
          {/* Panel header */}
          <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "var(--fg-primary)" }}>{selectedReport.subject}</p>
                <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--fg-muted)" }}>
                  {selectedReport.reporterRole} · {selectedReport.category}
                </p>
              </div>
              <button onClick={() => { setShowPanel(false); setSelectedReport(null); }}
                className="text-xs px-2 py-1 rounded-lg" style={{ color: "var(--fg-muted)", background: "var(--bg-base)" }}>
                ✕
              </button>
            </div>
            <button
              onClick={() => navigate(`/admin/reports/${selectedReport.id}`)}
              className="mt-3 w-full text-xs py-2 rounded-xl font-medium transition-all"
              style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--border-accent)" }}
            >
              View Full Report →
            </button>
          </div>

          {/* Description preview */}
          <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--fg-muted)" }}>Description</p>
            <p className="text-xs leading-relaxed line-clamp-5" style={{ color: "var(--fg-primary)" }}>{selectedReport.description}</p>
          </div>

          {/* Status update */}
          <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--fg-muted)" }}>Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map(({ value, label, color, bg }) => (
                <button
                  key={value}
                  id={`status-btn-${value}`}
                  disabled={actionLoading || selectedReport.status === value}
                  onClick={() => handleUpdateStatus(value)}
                  className="py-1.5 rounded-xl text-[11px] font-semibold transition-all disabled:opacity-50"
                  style={{
                    background: selectedReport.status === value ? bg : "var(--bg-base)",
                    color: selectedReport.status === value ? color : "var(--fg-muted)",
                    border: `1px solid ${selectedReport.status === value ? color + "40" : "var(--border-default)"}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin notes */}
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
              id="save-note-btn"
              disabled={actionLoading}
              onClick={handleSaveNote}
              className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", color: "#fff", opacity: actionLoading ? 0.7 : 1 }}
            >
              {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <StickyNote size={12} />}
              {actionLoading ? "Saving…" : "Save Note"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
