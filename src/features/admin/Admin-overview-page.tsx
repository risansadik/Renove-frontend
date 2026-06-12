import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  Clock,
  CreditCard,
  DollarSign,
  FileCheck,
  Flag,
  Loader2,
  Server,
  ShieldCheck,
  Star,
  Stethoscope,
  TrendingUp,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import { adminDashboardService, type AdminDashboardData } from "../../services/api/admin-dashboard.service.ts";
import { SessionsTrendChart } from "./components/SessionsTrendChart.tsx";
import { RevenueGrowthChart } from "./components/RevenueGrowthChart.tsx";
import { SessionStatusChart } from "./components/SessionStatusChart.tsx";

const money = (value: number) => `$${Math.round(value).toLocaleString()}`;

const healthIcon = (label: string) => {
  if (label.includes("Payment")) return CreditCard;
  if (label.includes("Video")) return Video;
  if (label.includes("Database")) return Server;
  return ShieldCheck;
};

export const AdminOverviewPage = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardService
      .getDashboard()
      .then((response) => setDashboard(response.data))
      .finally(() => setLoading(false));
  }, []);

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

  const kpis = [
    { label: "Total Users", value: dashboard.kpis.totalUsers, icon: Users, tone: "text-brand-600 bg-brand-500/10" },
    { label: "Total Therapists", value: dashboard.kpis.totalTherapists, icon: Stethoscope, tone: "text-sage-600 bg-sage-500/10" },
    { label: "Total Sessions", value: dashboard.kpis.totalSessions, icon: Activity, tone: "text-indigo-600 bg-indigo-500/10" },
    { label: "Today's Sessions", value: dashboard.kpis.todaysSessions, icon: Clock, tone: "text-amber-600 bg-amber-500/10" },
    { label: "Active Sessions", value: dashboard.kpis.activeSessions, icon: Video, tone: "text-cyan-600 bg-cyan-500/10" },
    { label: "Total Revenue", value: money(dashboard.kpis.totalRevenue), icon: DollarSign, tone: "text-emerald-600 bg-emerald-500/10" },
    { label: "Monthly Revenue", value: money(dashboard.kpis.monthlyRevenue), icon: TrendingUp, tone: "text-green-600 bg-green-500/10" },
    { label: "Pending Reviews", value: dashboard.kpis.pendingProfileReviews, icon: FileCheck, tone: "text-rose-600 bg-rose-500/10" },
  ];

  const pendingActions = [
    { label: "Profile approvals", count: dashboard.pendingActions.profileApprovals, to: "/admin/reviews", icon: FileCheck },
    { label: "User reports", count: dashboard.pendingActions.userReports, to: "/admin/reports", icon: Flag },
    { label: "Refund requests", count: dashboard.pendingActions.refundRequests, to: "/admin/finance", icon: DollarSign },
    { label: "Verification requests", count: dashboard.pendingActions.verificationRequests, to: "/admin/therapists", icon: UserCheck },
    { label: "Support issues", count: dashboard.pendingActions.unresolvedSupportIssues, to: "/admin/reports", icon: AlertCircle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900 dark:text-white mb-1">Admin Dashboard</h1>
        <p className="text-brand-900/60 dark:text-slate-400 text-sm">Platform health, finance, operations, and activity at a glance.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-5 stat-card">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${tone}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-display font-bold text-brand-900 dark:text-white">{value}</p>
            <p className="text-brand-900/60 dark:text-slate-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

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

      <section className="grid xl:grid-cols-[0.9fr_1.1fr] gap-6">
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
            {dashboard.recentActivity.length === 0 && <p className="text-sm text-slate-400">No platform activity yet.</p>}
          </div>
        </div>
      </section>

      <section className="grid xl:grid-cols-3 gap-6">
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
                    <Star size={12} fill="currentColor" /> {therapist.averageRating > 0 ? therapist.averageRating.toFixed(1) : "New"}
                  </div>
                  <p className="text-[10px] text-slate-400">{therapist.totalRatings} reviews</p>
                </div>
              </div>
            ))}
            {dashboard.therapistPerformance.length === 0 && <p className="text-sm text-slate-400 py-8 text-center">No completed session rankings yet.</p>}
          </div>
        </div>

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

      <section className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
        <h2 className="font-semibold text-brand-900 dark:text-white mb-5">System Health & Platform Status</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-6 gap-3">
          {dashboard.systemHealth.map((item) => {
            const Icon = healthIcon(item.label);
            const operational = item.status === "operational";
            return (
              <div key={item.label} className="rounded-xl p-4 bg-white dark:bg-white/5 border border-brand-900/5 dark:border-white/10">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${operational ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                  <Icon size={17} />
                </div>
                <p className="text-sm font-bold text-brand-900 dark:text-white">{item.label}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${operational ? "bg-emerald-500" : "bg-amber-500"}`} />
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">{item.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
