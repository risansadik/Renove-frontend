import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { DashboardMetricsRowProps } from "../types/admin-overview.types";

export const DashboardMetricsRow = ({ dashboard, money }: DashboardMetricsRowProps) => {
  return (
    <section className="grid xl:grid-cols-3 gap-6">
      {/* Clinician Standings */}
      <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
        <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Therapist Performance</h2>
        <div className="space-y-3">
          {dashboard.therapistPerformance.map((therapist, index) => (
            <div key={therapist.therapistId} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/5">
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-brand-900 dark:text-white truncate">{therapist.name}</p>
                <p className="text-xs text-slate-400">{therapist.completedSessions} completed sessions</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star size={12} fill="currentColor" />{" "}
                  {therapist.averageRating > 0 ? therapist.averageRating.toFixed(1) : "New"}
                </div>
                <p className="text-[10px] text-slate-400">{therapist.totalRatings} reviews</p>
              </div>
            </div>
          ))}
          {dashboard.therapistPerformance.length === 0 && (
            <p className="text-sm text-slate-400 py-8 text-center">No completed session rankings yet.</p>
          )}
        </div>
      </div>

      {/* Cohort Account Growth */}
      <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
        <h2 className="font-semibold text-brand-900 dark:text-white mb-5">User & Therapist Growth</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["New Users", dashboard.growthSummary.newUsersThisMonth, `${dashboard.growthSummary.userGrowthPercent}% vs prev`],
            ["New Therapists", dashboard.growthSummary.newTherapistsThisMonth, `${dashboard.growthSummary.therapistGrowthPercent}% vs prev`],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-xl p-4 bg-white dark:bg-white/5">
              <p className="text-2xl font-bold text-brand-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
              <p className="text-[10px] text-emerald-600 mt-2">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Statement List */}
      <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-brand-900 dark:text-white">Financial Summary</h2>
          <Link to="/admin/finance" className="text-xs font-bold text-brand-600 hover:underline">Details</Link>
        </div>
        <div className="space-y-3">
          {[
            ["Total revenue", money(dashboard.financialSummary.totalRevenue)],
            ["Monthly revenue", money(dashboard.financialSummary.monthlyRevenue)],
            ["Pending payouts", money(dashboard.financialSummary.pendingTherapistPayouts)],
            ["Completed payouts", money(dashboard.financialSummary.completedPayouts)],
            ["Successful transactions", dashboard.financialSummary.successfulTransactionCount],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">{label}</span>
              <span className="font-bold text-brand-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};