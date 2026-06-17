import { UserCheck, Users, CheckCircle2, CalendarDays } from "lucide-react";
import type { ClientInsightsProps } from "../types/therapist-dashboard.types";

export const ClientInsights = ({ activeClients, newClients, returningClientCount, completedCount }: ClientInsightsProps) => {
  const insightMetrics = [
    { label: "Active", value: activeClients, icon: UserCheck },
    { label: "New This Month", value: newClients, icon: Users },
    { label: "Returning", value: returningClientCount, icon: CheckCircle2 },
    { label: "Total Sessions", value: completedCount, icon: CalendarDays },
  ];

  return (
    <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
      <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Client Insights</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {insightMetrics.map(({ label, value, icon: Icon }) => {
          return (
            <div key={label} className="rounded-xl p-3 bg-white dark:bg-white/5">
              <Icon size={16} className="text-brand-500 mb-2" />
              <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};