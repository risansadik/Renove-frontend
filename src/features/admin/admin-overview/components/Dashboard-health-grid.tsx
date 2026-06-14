import { CreditCard, Video, Server, ShieldCheck } from "lucide-react";
import type { DashboardHealthGridProps } from "../types/admin-overview.types";

export const DashboardHealthGrid = ({ dashboard }: DashboardHealthGridProps) => {
  const healthIcon = (label: string) => {
    if (label.includes("Payment")) return CreditCard;
    if (label.includes("Video")) return Video;
    if (label.includes("Database")) return Server;
    return ShieldCheck;
  };

  return (
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
  );
};