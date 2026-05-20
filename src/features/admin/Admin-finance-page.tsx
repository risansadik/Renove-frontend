import { useEffect, useState } from "react";
import paymentService from "../../services/api/payment.service.js";
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  FileText,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: string;
  walletId: string;
  walletType: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  status: "pending" | "completed" | "failed";
  bookingId?: string;
  consultationFee?: number;
  commissionPercentage?: number;
  platformFee?: number;
  totalPaid?: number;
  therapistEarnings?: number;
  refundAmount?: number;
  createdAt: string;
}

interface FinanceStats {
  totalRevenue: number;
  totalTherapistEarnings: number;
  totalPendingPayouts: number;
  totalWithdrawn: number;
  totalRefunded: number;
  commissionPercentage: number;
  transactions: Transaction[];
}

export const AdminFinancePage = () => {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newCommission, setNewCommission] = useState<number | "">("");
  const [updating, setUpdating] = useState(false);
  const [activeModal, setActiveModal] = useState<"revenue" | "earnings" | "pending" | "withdrawn" | "refunds" | null>(null);

  const getModalDetails = () => {
    if (!stats || !activeModal) return null;

    let title = "";
    let icon = null;
    let description = "";
    let data: Transaction[] = [];
    let valueColumnHeader = "";
    let renderValue: (t: Transaction) => string = () => "";
    let totalVal = 0;

    switch (activeModal) {
      case "revenue":
        title = "Platform Cumulative Revenue";
        icon = <TrendingUp size={20} className="text-green-600" />;
        description = "Detailed list of booking service fees earned by the platform from completed sessions.";
        data = stats.transactions.filter(
          (t) => t.platformFee !== undefined && t.platformFee > 0 && t.status === "completed"
        );
        valueColumnHeader = "Platform Share";
        renderValue = (t) => `+$${(t.platformFee || 0).toFixed(2)}`;
        totalVal = data.reduce((acc, t) => acc + (t.platformFee || 0), 0);
        break;

      case "earnings":
        title = "Clinician Total Earnings";
        icon = <DollarSign size={20} className="text-brand-600" />;
        description = "Completed payouts credited to clinicians' wallets from their booked and completed consultations.";
        data = stats.transactions.filter(
          (t) => t.consultationFee !== undefined && t.consultationFee > 0 && t.status === "completed"
        );
        valueColumnHeader = "Clinician Share";
        renderValue = (t) => `+$${(t.consultationFee || 0).toFixed(2)}`;
        totalVal = data.reduce((acc, t) => acc + (t.consultationFee || 0), 0);
        break;

      case "pending":
        title = "Pending Lock Payouts";
        icon = <Wallet size={20} className="text-yellow-600" />;
        description = "Escrow funds locked in transaction for booked sessions. These automatically move to available balance when completed.";
        data = stats.transactions.filter((t) => t.status === "pending");
        valueColumnHeader = "Pending Balance";
        renderValue = (t) => `$${t.amount.toFixed(2)}`;
        totalVal = data.reduce((acc, t) => acc + t.amount, 0);
        break;

      case "withdrawn":
        title = "Completed Payout Withdrawals";
        icon = <ArrowUpRight size={20} className="text-orange-600" />;
        description = "All processed direct withdrawals executed by clinicians from their available wallet funds.";
        data = stats.transactions.filter(
          (t) => t.walletType === "TherapistWallet" && t.type === "debit" && t.status === "completed"
        );
        valueColumnHeader = "Withdrawal Amount";
        renderValue = (t) => `-$${t.amount.toFixed(2)}`;
        totalVal = data.reduce((acc, t) => acc + t.amount, 0);
        break;

      case "refunds":
        title = "Refunds Audit Logs";
        icon = <ArrowDownLeft size={20} className="text-red-600" />;
        description = "Detailed audit list of client cancellation payouts under 100%, 50%, or 0% rules.";
        data = stats.transactions.filter((t) => t.refundAmount !== undefined && t.refundAmount > 0);
        valueColumnHeader = "Refunded Amount";
        renderValue = (t) => `-$${(t.refundAmount || 0).toFixed(2)}`;
        totalVal = data.reduce((acc, t) => acc + (t.refundAmount || 0), 0);
        break;
    }

    return { title, icon, description, data, valueColumnHeader, renderValue, totalVal };
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getAdminFinanceStats<FinanceStats>();
      if (res.success) {
        setStats(res.data);
        setNewCommission(res.data.commissionPercentage);
      } else {
        toast.error("Failed to load financial records");
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || "Failed to load financial stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStats();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommission === "" || newCommission < 0 || newCommission > 100) {
      toast.error("Commission must be between 0 and 100");
      return;
    }

    try {
      setUpdating(true);
      const res = await paymentService.updateAdminCommission(Number(newCommission));
      if (res.success) {
        toast.success("Platform commission updated successfully!");
        fetchStats();
      } else {
        toast.error("Failed to update commission rate");
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || "Failed to update commission");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between stagger-1">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">Financial Operations</h1>
          <p className="text-brand-900/60 text-sm">Platform ledger, analytics, and commission controller.</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-surface-50 border border-brand-900/10 hover:border-brand-900/20 text-brand-900 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-55"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Stats
        </button>
      </div>

      {loading && !stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-surface-50 rounded-2xl border border-brand-900/10 skeleton" />
            ))}
          </div>
          <div className="h-64 bg-surface-50 rounded-2xl border border-brand-900/10 skeleton" />
        </div>
      ) : (
        stats && (
          <div className="space-y-8">
            {/* Stats Cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div 
                onClick={() => setActiveModal("revenue")}
                className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 stat-card cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-brand-900/5 hover:border-brand-900/20 group stagger-1"
              >
                <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <TrendingUp size={18} className="text-green-600" />
                </div>
                <p className="text-2xl font-display font-extrabold text-brand-900">${stats.totalRevenue.toFixed(2)}</p>
                <p className="text-brand-900/60 text-xs mt-1">Platform Revenue</p>
              </div>

              <div 
                onClick={() => setActiveModal("earnings")}
                className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 stat-card cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-brand-900/5 hover:border-brand-900/20 group stagger-2"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <DollarSign size={18} className="text-brand-600" />
                </div>
                <p className="text-2xl font-display font-extrabold text-brand-900">${stats.totalTherapistEarnings.toFixed(2)}</p>
                <p className="text-brand-900/60 text-xs mt-1">Total Clinician Earnings</p>
              </div>

              <div 
                onClick={() => setActiveModal("pending")}
                className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 stat-card cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-brand-900/5 hover:border-brand-900/20 group stagger-3"
              >
                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Wallet size={18} className="text-yellow-600" />
                </div>
                <p className="text-2xl font-display font-extrabold text-brand-900">${stats.totalPendingPayouts.toFixed(2)}</p>
                <p className="text-brand-900/60 text-xs mt-1">Pending Payouts</p>
              </div>

              <div 
                onClick={() => setActiveModal("withdrawn")}
                className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 stat-card cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-brand-900/5 hover:border-brand-900/20 group stagger-4"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <ArrowUpRight size={18} className="text-orange-600" />
                </div>
                <p className="text-2xl font-display font-extrabold text-brand-900">${stats.totalWithdrawn.toFixed(2)}</p>
                <p className="text-brand-900/60 text-xs mt-1">Total Withdrawn</p>
              </div>

              <div 
                onClick={() => setActiveModal("refunds")}
                className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 stat-card col-span-2 lg:col-span-1 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all hover:bg-brand-900/5 hover:border-brand-900/20 group stagger-5"
              >
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <ArrowDownLeft size={18} className="text-red-600" />
                </div>
                <p className="text-2xl font-display font-extrabold text-brand-900">${stats.totalRefunded.toFixed(2)}</p>
                <p className="text-brand-900/60 text-xs mt-1">Refunds Processed</p>
              </div>
            </div>

            {/* Commission Settings Panel */}
            <div className="bg-surface-50 border border-brand-900/10 rounded-2xl p-6 stagger-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <Percent size={16} className="text-accent-500" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-brand-900 text-sm">Commission Configuration</h2>
                  <p className="text-brand-900/60 text-xs">Set the default dynamic platform service fee percentage.</p>
                </div>
              </div>
              <form onSubmit={handleUpdateCommission} className="flex flex-col sm:flex-row gap-3 max-w-md mt-4">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    disabled={updating}
                    value={newCommission}
                    onChange={(e) => setNewCommission(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full h-11 px-4 pr-10 rounded-xl bg-white/5 border border-brand-900/10 focus:border-brand-600 text-brand-900 font-mono text-sm outline-none transition-all disabled:opacity-60"
                    placeholder="Enter commission rate"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-brand-900/40 text-sm">%</span>
                </div>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary h-11 px-6 text-sm font-medium rounded-xl cursor-pointer w-auto"
                >
                  {updating ? "Saving..." : "Update Fee Rate"}
                </button>
              </form>
            </div>

            {/* Transactions Ledger Card */}
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
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                t.status === "completed" 
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
                            <td className={`py-4 px-4 text-right font-mono font-bold ${
                              isDebit ? "text-red-500" : "text-green-500"
                            }`}>
                              {isDebit ? "-" : "+"}${t.amount.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Detail Modal overlay */}
      <AnimatePresence>
        {activeModal && (() => {
          const details = getModalDetails();
          if (!details) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-md"
                style={{ background: "var(--bg-overlay)" }}
                onClick={() => setActiveModal(null)}
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden rounded-3xl"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-strong)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
                }}
              >
                {/* Header */}
                <div className="px-6 py-5 shrink-0 flex items-start justify-between border-b border-brand-900/10 bg-brand-900/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-brand-900/10 shadow-sm">
                      {details.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-brand-900">{details.title} Details</h3>
                      <p className="text-brand-900/60 text-xs mt-0.5">{details.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-900/10 text-brand-900/60 hover:text-brand-900 transition-colors border border-brand-900/10 bg-card cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Body - Scrollable list */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {details.data.length === 0 ? (
                    <div className="py-12 text-center text-brand-900/40 text-sm">
                      No matching records found contributing to this balance.
                    </div>
                  ) : (
                    <div className="divide-y divide-brand-900/5">
                      {details.data.map((t) => (
                        <div key={t.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                          <div>
                            <div className="font-medium text-brand-900">{t.description}</div>
                            <div className="text-[10px] text-brand-900/50 font-mono mt-0.5">
                              {new Date(t.createdAt).toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </div>
                            {t.bookingId && (
                              <div className="text-[9px] text-brand-900/40 font-mono mt-0.5">
                                Ref: {t.bookingId}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-brand-900">
                              {details.renderValue(t)}
                            </span>
                            {t.totalPaid !== undefined && (
                              <div className="text-[9px] text-brand-900/50 font-mono mt-0.5">
                                Out of ${t.totalPaid.toFixed(2)} total paid
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-brand-900/10 bg-brand-900/5 shrink-0 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-brand-900/60">Filtered Items:</span>{" "}
                    <span className="font-bold text-brand-900 font-mono">{details.data.length}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-bold text-brand-900">
                      Total: <span className="font-mono text-base">${details.totalVal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 border border-brand-900/10 hover:bg-brand-900/5 text-brand-900 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
