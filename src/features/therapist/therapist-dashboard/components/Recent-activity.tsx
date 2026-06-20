import { format } from "date-fns";
import type { RecentActivityProps } from "../types/therapist-dashboard.types";

export const RecentActivity = ({ activity }: RecentActivityProps) => (
  <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-4 md:p-6 xl:col-span-1 flex flex-col">
    <h2 className="font-semibold text-brand-900 dark:text-white mb-5 shrink-0">Recent Activity</h2>

    {activity.length === 0 ? (
      <p className="text-sm text-slate-400">No recent activity yet.</p>
    ) : (
      /* Scroll kicks in after 3 items (~3 × ~52px) */
      <div className="overflow-y-auto space-y-3" style={{ maxHeight: "156px" }}>
        {activity.map((item) => (
          <div key={item.id} className="flex gap-3">
            <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200">{item.label}</p>
              <p className="text-[10px] text-slate-400">{format(item.date, "MMM d, hh:mm a")}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);