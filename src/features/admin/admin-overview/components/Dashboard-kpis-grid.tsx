import { 
  Users, 
  Stethoscope, 
  Activity, 
  Clock, 
  Video, 
  DollarSign, 
  TrendingUp, 
  FileCheck 
} from "lucide-react";
import type { DashboardKpisGridProps } from "../types/admin-overview.types.ts";


export const DashboardKpisGrid = ({ dashboard, money }: DashboardKpisGridProps) => {
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

  return (
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
  );
};