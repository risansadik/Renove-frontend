import { ReportDetailsPanel } from "../components/Report-details-panel";
import { ReportsFilters } from "../components/Reports-filters";
import { ReportsHeader } from "../components/Reports-header";
import { ReportsListTable } from "../components/Reports-list-table";
import { useAdminReports } from "../hooks/use-admin-reports";

export const AdminReportsPage = () => {
  const {
    reports,
    filteredReports,
    loading,
    page,
    setPage,
    total,
    totalPages,
    filterStatus,
    setFilterStatus,
    filterCategory,
    setFilterCategory,
    search,
    setSearch,
    selectedReport,
    noteText,
    setNoteText,
    actionLoading,
    showPanel,
    refresh,
    handleSelectReport,
    handleClosePanel,
    handleUpdateStatus,
    handleSaveNote,
  } = useAdminReports();

  return (
    <div className="flex h-full gap-0" style={{ minHeight: 0 }}>
      {/* Left panel pipeline list */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <ReportsHeader
          total={total}
          reports={reports}
          filterStatus={filterStatus}
          setFilterStatus={(st) => { setFilterStatus(st); setPage(1); }}
          onRefresh={refresh}
        />

        <ReportsFilters
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={(cat) => { setFilterCategory(cat); setPage(1); }}
        />

        <ReportsListTable
          loading={loading}
          filteredReports={filteredReports}
          selectedReport={selectedReport}
          onSelect={handleSelectReport}
        />

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <span className="text-xs" style={{ color: "var(--fg-muted)" }}>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl text-xs font-medium disabled:opacity-40"
                style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl text-xs font-medium disabled:opacity-40"
                style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right panel: detail & actions */}
      {showPanel && selectedReport && (
        <ReportDetailsPanel
          report={selectedReport}
          noteText={noteText}
          setNoteText={setNoteText}
          actionLoading={actionLoading}
          onClose={handleClosePanel}
          onUpdateStatus={handleUpdateStatus}
          onSaveNote={handleSaveNote}
        />
      )}
    </div>
  );
};