import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Video, CheckCircle2, XCircle, Timer, AlertCircle, MoreVertical } from "lucide-react";
import bookingService, { type BookingResponse } from "../../services/api/booking.service";

export const UserSessionsPage = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getUserBookings();
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
      completed: "bg-brand-500/10 text-brand-500 border-brand-500/20",
      cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Timer size={14} />;
      case "accepted": return <CheckCircle2 size={14} />;
      case "rejected": return <XCircle size={14} />;
      case "completed": return <CheckCircle2 size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 dark:bg-white/5 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Sessions</h1>
        <p className="text-slate-500">Track your healing journey and upcoming appointments.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="dash-card p-12 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-500/5 flex items-center justify-center text-brand-500">
            <Calendar size={32} />
          </div>
          <div className="max-w-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No sessions yet</h3>
            <p className="text-sm text-slate-500">Start your recovery journey by booking your first session with a therapist.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const therapistName = typeof booking.therapistId === 'object' ? (booking.therapistId as any).name : 'Therapist';
            const sessionDate = typeof booking.slotId === 'object' ? new Date((booking.slotId as any).startTime) : new Date(booking.createdAt);
            const sessionTime = typeof booking.slotId === 'object' ? format(new Date((booking.slotId as any).startTime), "HH:mm") : "Scheduled";

            return (
              <div key={booking.id} className="dash-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex flex-col items-center justify-center text-brand-500 border border-brand-500/20">
                    <span className="text-[10px] font-bold uppercase leading-none">{format(sessionDate, "MMM")}</span>
                    <span className="text-xl font-bold leading-none">{format(sessionDate, "d")}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase flex items-center gap-1 ${getStatusBadge(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Video size={12} />
                        Video Call
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Session with {therapistName}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={14} /> {sessionTime}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>60 Minutes</span>
                    </div>

                    {booking.status === "rejected" && booking.rejectionReason && (
                      <div className="mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-[10px] text-red-500 font-medium">
                        <span className="font-bold uppercase mr-1">Reason:</span>
                        {booking.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {booking.status === "accepted" && (
                    <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-transform">
                      Join Session
                    </button>
                  )}
                  {booking.status === "pending" && (
                    <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border-2 border-slate-200 dark:border-white/10 text-slate-500 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      Reschedule
                    </button>
                  )}
                  <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-brand-500 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
