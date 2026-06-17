import { useNavigate } from "react-router-dom";
import { Search, RefreshCw } from "lucide-react";
import type { ReportStatus } from "../../../../services/api/report.service";
import { useMyReports } from "../hooks/use-my-reports";
import { STATUS_LABELS, type MyReportsPageProps } from "../types/my-reports.types";
import { ReportsPageHeader } from "../components/Reports-page-header";
import { ReportsEmptyState } from "../components/Reports-empty-state";
import { ReportRowCard } from "../components/Report-row-card";

export const MyReportsPage = ({ reportPath, detailBasePath }: MyReportsPageProps) => {
  const navigate = useNavigate();
  
  const {
    filtered,
    loading,
    page,
    setPage,
    total,
    totalPages,
    filterStatus,
    setFilterStatus,
    refresh,
  } = useMyReports();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ReportsPageHeader onReportClick={() => navigate(reportPath)} />

      {/* Filters row control options box */}
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
            {(Object.keys(STATUS_LABELS) as ReportStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-muted)" }}
        >
          <RefreshCw size={12} /> Refresh
        </button>
        <span className="ml-auto text-xs" style={{ color: "var(--fg-muted)" }}>
          {total} report{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Main Content Layout Pipeline */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "var(--bg-subtle)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <ReportsEmptyState onActionClick={() => navigate(reportPath)} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((report) => (
            <ReportRowCard
              key={report.id} 
              report={report} 
              onClick={() => navigate(`${detailBasePath}/${report.id}`)} 
            />
          ))}
        </div>
      )}

      {/* Pagination Controls Footer section */}
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