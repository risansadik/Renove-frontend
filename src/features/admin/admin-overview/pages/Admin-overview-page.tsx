import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminDashboard } from "../hooks/use-admin-dashboard.ts";
import { DashboardKpisGrid } from "../components/Dashboard-kpis-grid.tsx";
import { DashboardOperationsRow } from "../components/Dashboard-operations-row.tsx";
import { DashboardMetricsRow } from "../components/Dashboard-metrics-row.tsx";
import { DashboardHealthGrid } from "../components/Dashboard-health-grid.tsx";
import { SessionsTrendChart } from "../components/Sessions-trend-chart.tsx";
import { RevenueGrowthChart } from "../components/Revenue-growth-chart.tsx";
import { SessionStatusChart } from "../components/Session-status-chart.tsx";

export const AdminOverviewPage = () => {
  const { dashboard, loading, money } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-brand-600" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-8 text-center text-sm text-slate-500">
        Could not load admin dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title Layout */}
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900 dark:text-white mb-1">Admin Dashboard</h1>
        <p className="text-brand-900/60 dark:text-slate-400 text-sm">Platform health, finance, operations, and activity at a glance.</p>
      </div>

      {/* Extracted KPI Cards Panel */}
      <DashboardKpisGrid dashboard={dashboard} money={money} />

      {/* Interactive Activity Trend Analytics Grid */}
      <section className="grid xl:grid-cols-[1fr_0.85fr] gap-6">
        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-brand-900 dark:text-white">Sessions Trend</h2>
            <p className="text-xs text-brand-900/50 dark:text-slate-500">Booked and completed sessions over time</p>
          </div>
          <SessionsTrendChart data={dashboard.sessionsTrend} />
        </div>

        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-brand-900 dark:text-white">Session Status Distribution</h2>
            <p className="text-xs text-brand-900/50 dark:text-slate-500">Clickable legend with counts and percentages</p>
          </div>
          <SessionStatusChart data={dashboard.sessionStatusDistribution} />
        </div>
      </section>

      {/* Revenue Section */}
      <section className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div>
            <h2 className="font-semibold text-brand-900 dark:text-white">Revenue Growth</h2>
            <p className="text-xs text-brand-900/50 dark:text-slate-500">Monthly platform revenue trend</p>
          </div>
          <Link to="/admin/finance" className="text-xs font-bold text-brand-600 hover:underline">Open finance</Link>
        </div>
        <RevenueGrowthChart data={dashboard.revenueTrend} />
      </section>

      {/* Extracted Action Queues and Feeds */}
      <DashboardOperationsRow dashboard={dashboard} />

      {/* Extracted Ranks, Balances, and Cohort Growth Layout */}
      <DashboardMetricsRow dashboard={dashboard} money={money} />

      {/* Extracted Services Health Status Grid */}
      <DashboardHealthGrid dashboard={dashboard} />
    </div>
  );
};