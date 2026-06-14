import { TrendingUp, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { FinanceStatsGridProps } from "../types/admin-finance.types";

export const FinanceStatsGrid = ({ stats, loading, setActiveModal }: FinanceStatsGridProps) => {
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-surface-50 rounded-2xl border border-brand-900/10 skeleton" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
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
  );
};