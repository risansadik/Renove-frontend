import { format } from "date-fns";
import { Video } from "lucide-react";
import { formatSessionTime, getClientName, getSessionStart, type TodayScheduleProps } from "../types/therapist-dashboard.types";

export const TodaySchedule = ({ bookings, onNavigateToSessions, onNavigateToSessionRoom }: TodayScheduleProps) => (
  <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
    <div className="flex items-center justify-between gap-3 mb-5">
      <div>
        <h2 className="font-semibold text-brand-900 dark:text-white">Today's Schedule</h2>
        <p className="text-xs text-brand-900/50 dark:text-slate-500">Sessions ordered by time</p>
      </div>
      <button onClick={onNavigateToSessions} className="text-xs font-bold text-brand-600 hover:underline">View all</button>
    </div>
    <div className="space-y-3">
      {bookings.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
          No sessions scheduled for today.
        </div>
      ) : (
        bookings.map((booking) => {
          const readyToJoin = booking.status === "confirmed" && new Date() >= getSessionStart(booking);
          return (
            <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-black uppercase">{format(getSessionStart(booking), "EEE")}</span>
                  <span className="text-lg font-black leading-none">{format(getSessionStart(booking), "d")}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{getClientName(booking)}</p>
                  <p className="text-xs text-slate-400">{formatSessionTime(booking)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-[10px] font-black uppercase text-slate-500">{booking.status.replace("_", " ")}</span>
                <button onClick={onNavigateToSessions} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200">View Details</button>
                {readyToJoin && (
                  <button onClick={() => onNavigateToSessionRoom(booking.id)} className="px-3 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5">
                    <Video size={13} /> Join
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);