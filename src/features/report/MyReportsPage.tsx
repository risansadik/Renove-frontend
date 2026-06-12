import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flag, ChevronRight, Search, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import reportService, { type Report, type ReportStatus } from "../../services/api/report.service";

const STATUS_STYLE: Record<ReportStatus, { label: string; color: string; bg: string; dot: string }> = {
  open:      { label: "Open",      color: "#6366f1", bg: "rgba(99,102,241,0.1)",  dot: "#6366f1" },
  in_review: { label: "In Review", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  dot: "#f59e0b" },
  resolved:  { label: "Resolved",  color: "#22c55e", bg: "rgba(34,197,94,0.1)",   dot: "#22c55e" },
  rejected:  { label: "Rejected",  color: "#ef4444", bg: "rgba(239,68,68,0.1)",   dot: "#ef4444" },
};

interface MyReportsPageProps {
  /** Base path used by the "Report Issue" CTA, e.g. "/dashboard/report" or "/therapist/report" */
  reportPath: string;
  /** Path to navigate to on row click, e.g. "/dashboard/reports" */
  detailBasePath: string;
}

export const MyReportsPage = ({ reportPath, detailBasePath }: MyReportsPageProps) => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "">("");
  const limit = 10;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchReports = async (p: number) => {
    setLoading(true);
    try {
      const res = await reportService.getMyReports(p, limit);
      if (res.data) {
        setReports(res.data.data);
        setTotal(res.data.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const filtered = filterStatus ? reports.filter((r) => r.status === filterStatus) : reports;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>My Reports</h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
            Track the status of issues you've submitted.
          </p>
        </div>
        <button
          id="new-report-btn"
          onClick={() => navigate(reportPath)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all self-start sm:self-auto"
          style={{
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            color: "#fff",
          }}
        >
          <Flag size={14} /> Report Issue
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--fg-muted)" }} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReportStatus | "")}
            className="appearance-none pl-8 pr-8 py-2 rounded-xl text-xs font-medium outline-none transition-all"
            style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
          >
            <option value="">All Statuses</option>
            {(Object.keys(STATUS_STYLE) as ReportStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_STYLE[s].label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => fetchReports(page)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-muted)" }}
        >
          <RefreshCw size={12} /> Refresh
        </button>
        <span className="ml-auto text-xs" style={{ color: "var(--fg-muted)" }}>
          {total} report{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "var(--bg-subtle)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
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
            onClick={() => navigate(reportPath)}
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--border-accent)" }}
          >
            Submit a Report
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((report) => {
            const st = STATUS_STYLE[report.status];
            return (
              <div
                key={report.id}
                onClick={() => navigate(`${detailBasePath}/${report.id}`)}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all group"
                style={{
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border-default)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)"; }}
              >
                {/* Status dot */}
                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1" style={{ background: st.dot }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--fg-primary)" }}>{report.subject}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--fg-muted)" }}>{report.category}</p>
                </div>

                {/* Status badge */}
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ color: st.color, background: st.bg }}
                >
                  {st.label}
                </span>

                {/* Date */}
                <span className="text-[11px] flex-shrink-0 hidden sm:block" style={{ color: "var(--fg-muted)" }}>
                  {format(new Date(report.createdAt), "MMM d, yyyy")}
                </span>

                <ChevronRight size={14} style={{ color: "var(--fg-muted)" }} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
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
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl text-xs font-medium disabled:opacity-40 transition-all"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-xl text-xs font-medium disabled:opacity-40 transition-all"
              style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
