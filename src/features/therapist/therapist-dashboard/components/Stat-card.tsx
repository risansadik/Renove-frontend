import type { StatCardProps } from "../types/therapist-dashboard.types";

export const StatCard = ({ label, value, icon: Icon, tone }: StatCardProps) => (
  <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-4">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${tone}`}>
      <Icon size={17} />
    </div>
    <p className="text-2xl font-display font-bold text-brand-900 dark:text-white">{value}</p>
    <p className="text-brand-900/60 dark:text-slate-400 text-xs mt-1">{label}</p>
  </div>
);