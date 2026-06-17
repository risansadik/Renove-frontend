import { Clock, Check, X } from "lucide-react";
import { format } from "date-fns";
import { formatSessionTime, getClientName, getSessionStart, type PendingRequestsProps } from "../types/therapist-dashboard.types";

export const PendingRequests = ({ bookings, actionId, onStatusUpdate }: PendingRequestsProps) => (
  <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
    <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Pending Booking Requests</h2>
    <div className="space-y-3">
      {bookings.slice(0, 4).map((booking) => (
        <div key={booking.id} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
          <div className="flex justify-between gap-3 mb-3">
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">{getClientName(booking)}</p>
              <p className="text-xs text-slate-400">{format(getSessionStart(booking), "MMM d")} at {formatSessionTime(booking)}</p>
            </div>
            <Clock size={16} className="text-amber-500 shrink-0" />
          </div>
          <div className="flex gap-2">
            <button disabled={actionId === booking.id} onClick={() => onStatusUpdate(booking.id, "rejected")} className="flex-1 h-9 rounded-xl border border-red-500/20 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50">
              <X size={13} /> Decline
            </button>
            <button disabled={actionId === booking.id} onClick={() => onStatusUpdate(booking.id, "awaiting_payment")} className="flex-1 h-9 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50">
              <Check size={13} /> Accept
            </button>
          </div>
        </div>
      ))}
      {bookings.length === 0 && <p className="text-sm text-slate-400 py-8 text-center">No booking requests waiting.</p>}
    </div>
  </div>
);