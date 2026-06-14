import { RefreshCw } from "lucide-react";
import { useFinanceManagement } from "../hooks/use-finance-management.ts";
import { FinanceStatsGrid } from "../components/Finance-stats-grid.tsx";
import { CommissionConfig } from "../components/Commission-config.tsx";
import { FinancialLedgerTable } from "../components/Financial-ledger-table.tsx";
import { FinanceDetailModal } from "../components/Finance-detail-modal.tsx";

export const AdminFinancePage = () => {
  const {
    stats,
    loading,
    newCommission,
    setNewCommission,
    updating,
    activeModal,
    setActiveModal,
    page,
    setPage,
    totalPages,
    totalTransactions,
    fetchStats,
    handleUpdateCommission,
  } = useFinanceManagement();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between stagger-1">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">Financial Operations</h1>
          <p className="text-brand-900/60 text-sm">Platform ledger, analytics, and commission controller.</p>
        </div>
        <button
          onClick={() => { setPage(1); void fetchStats(1); }}
          disabled={loading}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-surface-50 border border-brand-900/10 hover:border-brand-900/20 text-brand-900 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-55"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Stats
        </button>
      </div>

      <div className="space-y-8">
        {/* Stats Cards grid */}
        <FinanceStatsGrid stats={stats} loading={loading} setActiveModal={setActiveModal} />

        {stats && (
          <>
            {/* Commission Settings Panel */}
            <CommissionConfig
              newCommission={newCommission}
              setNewCommission={setNewCommission}
              updating={updating}
              handleUpdateCommission={handleUpdateCommission}
            />

            {/* Transactions Ledger Card */}
            <FinancialLedgerTable
              stats={stats}
              loading={loading}
              page={page}
              totalPages={totalPages}
              totalTransactions={totalTransactions}
              setPage={setPage}
            />
          </>
        )}
      </div>

      {/* Detail Modal overlay */}
      <FinanceDetailModal activeModal={activeModal} setActiveModal={setActiveModal} stats={stats} />
    </div>
  );
};