import { useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import { Check, X, Clock, User, Video, Calendar, MoreVertical, MessageSquare } from "lucide-react";
import bookingService, { type BookingResponse } from "../../services/api/booking.service";
import toast from "react-hot-toast";
import { ConfirmationModal } from "../../components/common/Confirmation-modal";

export const TherapistSessionsPage = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getTherapistBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const [rejectionId, setRejectionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleStatusUpdate = async (id: string, status: string, reason?: string) => {
    try {
      await bookingService.updateBookingStatus(id, status, reason);
      toast.success(`Booking ${status} successfully`);
      setRejectionId(null);
      setRejectionReason("");
      fetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const safeFormat = (dateStr: string | undefined, formatStr: string, fallback = "—") => {
    if (!dateStr) return fallback;
    const date = new Date(dateStr);
    return isValid(date) ? format(date, formatStr) : fallback;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        {[1, 2, 4].map(i => (
          <div key={i} className="h-48 bg-slate-100 dark:bg-white/5 rounded-3xl" />
        ))}
      </div>
    );
  }

  const pending = bookings.filter(b => b.status === "pending");
  const upcoming = bookings.filter(b => b.status === "accepted");

  const INBUILT_REASONS = [
    "Schedule conflict with other session",
    "Time slot no longer available",
    "Personal emergency / Unavailable",
    "Medical emergency",
    "Not the right specialist for your needs",
    "Technical issues / Power outage"
  ];

  return (
    <div className="space-y-8 pb-12">
      <ConfirmationModal
        isOpen={!!rejectionId}
        onClose={() => { setRejectionId(null); setRejectionReason(""); }}
        onConfirm={() => rejectionId && handleStatusUpdate(rejectionId, "rejected", rejectionReason)}
        title="Decline Request"
        description="Please provide a reason for declining this request. This helps the patient understand why and when to book again."
        confirmText="Confirm Decline"
        isDestructive
      >
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {INBUILT_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRejectionReason(r)}
                className={`text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                  rejectionReason === r 
                    ? "bg-red-500 text-white border-red-500 shadow-sm" 
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Custom Reason / Additional Note</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 text-sm transition-all focus:ring-2"
              style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
              placeholder="Provide more details here..."
              rows={3}
            />
          </div>
        </div>
      </ConfirmationModal>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sessions Manager</h1>
        <p className="text-slate-500">Manage your clinical schedule and incoming patient requests.</p>
      </div>

      {/* Requests Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Incoming Requests</h2>
          <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-black">{pending.length}</span>
        </div>

        {pending.length === 0 ? (
          <div className="dash-card p-12 border-dashed border-2 flex flex-col items-center justify-center text-center text-slate-400">
             <Clock size={32} className="mb-2 opacity-20" />
             <p className="text-sm font-medium">No new requests at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pending.map((booking) => {
              const patientName = typeof booking.userId === 'object' ? (booking.userId as any).name : `Patient #${booking.userId.slice(-4)}`;
              return (
                <div key={booking.id} className="dash-card p-6 border-l-4 border-l-amber-500 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{patientName}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar size={12} /> {safeFormat((booking as any).date || (booking as any).createdAt, "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">
                        {(booking as any).slot || "Scheduled"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">60 Min Session</span>
                    </div>
                  </div>

                  {booking.note && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-400 italic">
                      "{booking.note}"
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 mt-auto">
                    <button 
                      onClick={() => setRejectionId(booking.id)}
                      className="flex-1 py-2.5 rounded-xl border-2 border-red-500/10 text-red-500 font-bold text-xs hover:bg-red-500/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={14} /> Decline
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(booking.id, "accepted")}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      <Check size={14} /> Accept Request
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Upcoming Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Confirmed Sessions</h2>
        
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500 italic">You don't have any confirmed sessions scheduled yet.</p>
        ) : (
          <div className="grid gap-3">
            {upcoming.map((booking) => {
              const patientName = typeof booking.userId === 'object' ? (booking.userId as any).name : `Patient #${booking.userId.slice(-4)}`;
              return (
                <div key={booking.id} className="dash-card p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-brand-500/5 text-brand-500 border border-brand-500/10">
                        <span className="text-[9px] font-black uppercase leading-none">{safeFormat((booking as any).date || (booking as any).createdAt, "EEE")}</span>
                        <span className="text-lg font-black leading-none">{safeFormat((booking as any).date || (booking as any).createdAt, "d")}</span>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-slate-900 dark:text-white">{patientName}</h4>
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-tighter">Confirmed</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1"><Clock size={12} /> {(booking as any).slot || "Scheduled"}</span>
                          <span className="flex items-center gap-1"><Video size={12} /> Video Call</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
                      <MessageSquare size={18} />
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-brand-900 dark:bg-brand-500 text-white font-bold text-xs shadow-md">
                      Launch Room
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
