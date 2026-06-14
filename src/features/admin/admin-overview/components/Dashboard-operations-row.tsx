import { Link } from "react-router-dom";
import { FileCheck, Flag, DollarSign, UserCheck, AlertCircle } from "lucide-react";
import type { DashboardOperationsRowProps } from "../types/admin-overview.types";

export const DashboardOperationsRow = ({ dashboard }: DashboardOperationsRowProps) => {
  const pendingActions = [
    { label: "Profile approvals", count: dashboard.pendingActions.profileApprovals, to: "/admin/reviews", icon: FileCheck },
    { label: "User reports", count: dashboard.pendingActions.userReports, to: "/admin/reports", icon: Flag },
    { label: "Refund requests", count: dashboard.pendingActions.refundRequests, to: "/admin/finance", icon: DollarSign },
    { label: "Verification requests", count: dashboard.pendingActions.verificationRequests, to: "/admin/therapists", icon: UserCheck },
    { label: "Support issues", count: dashboard.pendingActions.unresolvedSupportIssues, to: "/admin/reports", icon: AlertCircle },
  ];

  return (
    <section className="grid xl:grid-cols-[0.9fr_1.1fr] gap-6">
      {/* Pending Actions Panel */}
      <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
        <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Pending Actions</h2>
        <div className="space-y-3">
          {pendingActions.map(({ label, count, to, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-brand-900/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-900 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-400">{count} waiting</p>
                </div>
              </div>
              <Link to={to} className="px-3 py-2 rounded-xl border border-brand-900/10 dark:border-white/10 text-xs font-bold text-brand-700 dark:text-slate-200">
                Review
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed Panel */}
      <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
        <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Recent Activity Feed</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {dashboard.recentActivity.map((item) => (
            <div key={item.id} className="flex gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-200">{item.message}</p>
                <p className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {dashboard.recentActivity.length === 0 && (
            <p className="text-sm text-slate-400">No platform activity yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};