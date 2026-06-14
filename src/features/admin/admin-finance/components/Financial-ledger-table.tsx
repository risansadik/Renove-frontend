import { FileText, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import type { FinancialLedgerTableProps } from "../types/admin-finance.types";

export const FinancialLedgerTable = ({
  stats,
  loading,
  page,
  totalPages,
  totalTransactions,
  setPage,
}: FinancialLedgerTableProps) => {
  if (loading && !stats) {
    return <div className="h-64 bg-surface-50 rounded-2xl border border-brand-900/10 skeleton" />;
  }

  if (!stats) return null;

  return (
    <div className="bg-surface-50 border border-brand-900/10 rounded-2xl p-6 stagger-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-800/10 flex items-center justify-center">
            <FileText size={16} className="text-brand-800" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-brand-900 text-sm">Unified Financial Ledger</h2>
            <p className="text-brand-900/60 text-xs">Auditable transaction history of bookings and refunds.</p>
          </div>
        </div>
      </div>

      {stats.transactions.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-brand-900/40 text-sm">No transactions in the unified ledger yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-brand-900/5 text-brand-900/40 font-medium">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Audited Fields</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Transfer Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-900/5 text-brand-900">
              {stats.transactions.map((t) => {
                const isDebit = t.type === "debit";
                return (
                  <tr key={t.id} className="hover:bg-brand-900/5 transition-colors">
                    <td className="py-4 px-4 font-mono text-[10px] text-brand-900/60">
                      {new Date(t.createdAt).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short"
                      })}
                    </td>
                    <td className="py-4 px-4 font-medium max-w-xs truncate">
                      <div>{t.description}</div>
                      {t.bookingId && (
                        <div className="text-[10px] text-brand-900/40 font-mono mt-0.5">
                          Booking: {t.bookingId}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[10px] text-brand-900/60 font-mono space-y-0.5">
                      {t.totalPaid !== undefined && (
                        <div>Total Paid: ${t.totalPaid.toFixed(2)}</div>
                      )}
                      {t.consultationFee !== undefined && (
                        <div>Clinician: ${t.consultationFee.toFixed(2)} ({100 - (t.commissionPercentage || 0)}%)</div>
                      )}
                      {t.platformFee !== undefined && (
                        <div>Platform Fee: ${t.platformFee.toFixed(2)} ({t.commissionPercentage}%)</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${t.status === "completed"
                        ? "bg-green-500/10 text-green-600"
                        : t.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-red-500/10 text-red-600"
                        }`}>
                        {t.status === "completed" ? (
                          <CheckCircle size={10} />
                        ) : t.status === "pending" ? (
                          <RefreshCw size={10} className="animate-spin" />
                        ) : (
                          <AlertCircle size={10} />
                        )}
                        {t.status}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-right font-mono font-bold ${isDebit ? "text-red-500" : "text-green-500"}`}>
                      {isDebit ? "-" : "+"}${t.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between stagger-5">
          <p className="text-sm text-brand-900/60">
            Page {page} of {totalPages} · {totalTransactions} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-brand-900/10 text-sm font-medium text-brand-900 disabled:opacity-50 hover:bg-brand-900/5 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-brand-900/10 text-sm font-medium text-brand-900 disabled:opacity-50 hover:bg-brand-900/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};