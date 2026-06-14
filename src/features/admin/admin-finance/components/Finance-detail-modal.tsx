import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { FinanceDetailModalProps, Transaction } from "../types/admin-finance.types";


export const FinanceDetailModal = ({ activeModal, setActiveModal, stats }: FinanceDetailModalProps) => {
  const getModalDetails = () => {
    if (!stats || !activeModal) return null;

    let title = "";
    let icon = null;
    let description = "";
    let data: Transaction[] = [];
    let valueColumnHeader = "";
    let renderValue: (t: Transaction) => string = () => "";
    const totalVal = 0;

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
        break;

      case "pending":
        title = "Pending Lock Payouts";
        icon = <Wallet size={20} className="text-yellow-600" />;
        description = "Escrow funds locked in transaction for booked sessions. These automatically move to available balance when completed.";
        data = stats.transactions.filter((t) => t.status === "pending");
        valueColumnHeader = "Pending Balance";
        renderValue = (t) => `$${t.amount.toFixed(2)}`;
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
        break;

      case "refunds":
        title = "Refunds Audit Logs";
        icon = <ArrowDownLeft size={20} className="text-red-600" />;
        description = "Detailed audit list of client cancellation payouts under 100%, 50%, or 0% rules.";
        data = stats.transactions.filter((t) => t.refundAmount !== undefined && t.refundAmount > 0);
        valueColumnHeader = "Refunded Amount";
        renderValue = (t) => `-$${(t.refundAmount || 0).toFixed(2)}`;
        break;
    }

    return { title, icon, description, data, valueColumnHeader, renderValue, totalVal };
  };

  const details = getModalDetails();

  return (
    <AnimatePresence>
      {activeModal && details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md"
            style={{ background: "var(--bg-overlay)" }}
            onClick={() => setActiveModal(null)}
          />

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
      )}
    </AnimatePresence>
  );
};