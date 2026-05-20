import { useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import { Check, X, Clock, User, Video, Calendar, MoreVertical, MessageSquare, CreditCard, CheckCircle } from "lucide-react";
import bookingService, { type BookingResponse } from "../../services/api/booking.service";
import paymentService from "../../services/api/payment.service";
import toast from "react-hot-toast";
import { ConfirmationModal } from "../../components/common/Confirmation-modal";
import { PaymentTimer } from "./components/PaymentTimer";

export const TherapistSessionsPage = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchBookings = async (p: number, l: number) => {
    setIsLoading(true);
    try {
      const response = await bookingService.getTherapistBookings(p, l);
      setBookings(response.data);
      if (response.meta) {
        setTotalPages(response.meta.totalPages);
        setPage(response.meta.page);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(page, limit);
  }, [page, limit]);

  const [rejectionId, setRejectionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleStatusUpdate = async (id: string, status: string, reason?: string) => {
    try {
      await bookingService.updateBookingStatus(id, status, reason);
      toast.success(`Booking ${status} successfully`);
      setRejectionId(null);
      setRejectionReason("");
      fetchBookings(page, limit);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleCompleteSession = async (bookingId: string) => {
    try {
      await paymentService.completeSession(bookingId);
      toast.success("Session marked as completed. Funds moved to available balance.");
      fetchBookings(page, limit);
    } catch (error: any) {
      toast.error(error.message || "Failed to complete session");
    }
  };

  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState("");

  const handleCancelBooking = async () => {
    if (!cancelId) return;
    try {
      const loadingToast = toast.loading("Cancelling session...");
      await bookingService.cancelBooking(cancelId, cancelReasonText || "Therapist requested cancellation");
      toast.success("Session cancelled successfully", { id: loadingToast });
      setCancelId(null);
      setCancelReasonText("");
      fetchBookings(page, limit);
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel session");
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
  const awaitingPayment = bookings.filter(b => b.status === "awaiting_payment");
  const upcoming = bookings.filter(b => b.status === "accepted" || b.status === "confirmed");
  const pastAndCancelled = bookings.filter(b => ["cancelled", "rejected", "completed", "expired", "no_show"].includes(b.status));

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

      <ConfirmationModal
        isOpen={!!cancelId}
        onClose={() => { setCancelId(null); setCancelReasonText(""); }}
        onConfirm={handleCancelBooking}
        title="Cancel Confirmed Session"
        description="Are you sure you want to cancel this session? The patient will be automatically notified, their payment will be refunded, and the slot will be freed."
        confirmText="Yes, Cancel Session"
        isDestructive
      >
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Predefined Reasons (Click to select)</label>
            <div className="flex flex-wrap gap-2">
              {[
                "Schedule conflict / Double booking",
                "Personal / Family emergency",
                "Illness or medical issue",
                "Technical / Internet connection issue",
                "Patient requested cancellation / Reschedule",
                "Inability to provide appropriate clinical care"
              ].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setCancelReasonText(r)}
                  className={`text-[10px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    cancelReasonText === r 
                      ? "bg-red-500 text-white border-red-500 shadow-sm" 
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reason / Custom Explanation</label>
            <textarea
              value={cancelReasonText}
              onChange={(e) => setCancelReasonText(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 text-sm transition-all focus:ring-2"
              style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
              placeholder="Please explain why you need to cancel this session..."
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
              const patientName = typeof booking.userId === 'object' && booking.userId !== null ? (booking.userId as { id: string; name: string }).name : `Patient #${typeof booking.userId === 'string' ? booking.userId.slice(-4) : ''}`;
              const sessionDate = typeof booking.slotId === 'object' ? new Date(booking.slotId.startTime) : new Date(booking.createdAt);
              
              let sessionTime = "Scheduled";
              let durationText = "60 Min Session";
              if (typeof booking.slotId === 'object') {
                const start = new Date(booking.slotId.startTime);
                const end = new Date(booking.slotId.endTime);
                sessionTime = `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;
                const diffMs = end.getTime() - start.getTime();
                durationText = `${Math.round(diffMs / 60000)} Min Session`;
              }
              const requestedDate = format(new Date(booking.createdAt), "MMM d, yyyy 'at' hh:mm a");

              return (
                <div key={booking.id} className="dash-card p-6 border-l-4 border-l-amber-500 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{patientName}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Requested on {requestedDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-1 border border-brand-500/10">
                        {format(sessionDate, "EEE, MMM d, yyyy")}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white block">
                        {sessionTime}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{durationText}</span>
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
                      onClick={() => handleStatusUpdate(booking.id, "awaiting_payment")}
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

      {/* Awaiting Payment Section */}
      {awaitingPayment.length > 0 && (
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Awaiting Payment</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black">{awaitingPayment.length}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {awaitingPayment.map((booking) => {
              const patientName = typeof booking.userId === 'object' && booking.userId !== null ? (booking.userId as { id: string; name: string }).name : `Patient #${typeof booking.userId === 'string' ? booking.userId.slice(-4) : ''}`;
              const sessionDate = typeof booking.slotId === 'object' ? new Date(booking.slotId.startTime) : new Date(booking.createdAt);
              
              let sessionTime = "Scheduled";
              if (typeof booking.slotId === 'object') {
                const start = new Date(booking.slotId.startTime);
                const end = new Date(booking.slotId.endTime);
                sessionTime = `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;
              }
              const requestedDate = format(new Date(booking.createdAt), "MMM d, yyyy 'at' hh:mm a");

              return (
                <div key={booking.id} className="dash-card p-6 border-l-4 border-l-blue-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">{patientName}</h4>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-tighter">Awaiting Payment</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
                          <Calendar size={12} className="shrink-0" /> {format(sessionDate, "EEE, MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1"><Clock size={12} className="shrink-0" /> {sessionTime}</span>
                      </div>
                      <p className="text-[10px] text-slate-400/80 mt-1">Requested on {requestedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <PaymentTimer 
                      updatedAt={booking.updatedAt} 
                      onExpire={() => fetchBookings(page, limit)} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Upcoming Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Confirmed Sessions</h2>
        
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500 italic">You don't have any confirmed sessions scheduled yet.</p>
        ) : (
          <div className="grid gap-3">
            {upcoming.map((booking) => {
              const patientName = typeof booking.userId === 'object' && booking.userId !== null ? (booking.userId as { id: string; name: string }).name : `Patient #${typeof booking.userId === 'string' ? booking.userId.slice(-4) : ''}`;
              const sessionDate = typeof booking.slotId === 'object' ? new Date(booking.slotId.startTime) : new Date(booking.createdAt);
              
              let sessionTime = "Scheduled";
              if (typeof booking.slotId === 'object') {
                const start = new Date(booking.slotId.startTime);
                const end = new Date(booking.slotId.endTime);
                sessionTime = `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;
              }

              return (
                <div key={booking.id} className="dash-card p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-brand-500/5 text-brand-500 border border-brand-500/10">
                        <span className="text-[9px] font-black uppercase leading-none">{format(sessionDate, "EEE")}</span>
                        <span className="text-lg font-black leading-none">{format(sessionDate, "d")}</span>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-slate-900 dark:text-white">{patientName}</h4>
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-tighter">Confirmed</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1"><Clock size={12} /> {sessionTime}</span>
                          <span className="flex items-center gap-1"><Video size={12} /> Video Call</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
                      <MessageSquare size={18} />
                    </button>
                    {booking.status === "confirmed" && (() => {
                      // Logic: Show Complete button only if current time > session start time
                      const now = new Date();
                      
                      let sessionStartTime = now; // Fallback
                      if (typeof booking.slotId === 'object' && booking.slotId.startTime) {
                        sessionStartTime = new Date(booking.slotId.startTime);
                      }
                      
                      return now >= sessionStartTime;
                    })() ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCompleteSession(booking.id)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2"
                        >
                          <CheckCircle size={14} />
                          Complete Session
                        </button>
                        <button
                          onClick={() => {
                            setCancelId(booking.id);
                          }}
                          className="px-3 py-2.5 rounded-xl border border-red-500/20 text-red-500 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : booking.status === "confirmed" ? (
                      <div className="flex items-center gap-2">
                        <div className="px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-[10px] border border-amber-500/20 flex items-center gap-2">
                          <Clock size={12} />
                          Upcoming
                        </div>
                        <button
                          onClick={() => {
                            setCancelId(booking.id);
                          }}
                          className="px-3 py-2.5 rounded-xl border border-red-500/20 text-red-500 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 font-bold text-xs">
                        Awaiting Payment
                      </div>
                    )}
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

      {/* Session History */}
      {pastAndCancelled.length > 0 && (
        <section className="space-y-4 pt-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Session History</h2>
          <div className="grid gap-3">
            {pastAndCancelled.map((booking) => {
              const patientName = typeof booking.userId === 'object' && booking.userId !== null ? (booking.userId as { id: string; name: string }).name : `Patient #${typeof booking.userId === 'string' ? booking.userId.slice(-4) : ''}`;
              const sessionDate = typeof booking.slotId === 'object' ? new Date(booking.slotId.startTime) : new Date(booking.createdAt);
              
              let sessionTime = "Scheduled";
              if (typeof booking.slotId === 'object') {
                const start = new Date(booking.slotId.startTime);
                const end = new Date(booking.slotId.endTime);
                sessionTime = `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;
              }

              return (
                <div key={booking.id} className="dash-card p-5 flex items-center justify-between gap-4 opacity-75">
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/10">
                        <span className="text-[9px] font-black uppercase leading-none">{format(sessionDate, "EEE")}</span>
                        <span className="text-lg font-black leading-none">{format(sessionDate, "d")}</span>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-bold text-slate-900 dark:text-white">{patientName}</h4>
                          <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                            booking.status === "completed" 
                              ? "bg-brand-500/10 text-brand-500" 
                              : booking.status === "cancelled" 
                                ? "bg-red-500/10 text-red-500" 
                                : "bg-slate-500/10 text-slate-500"
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1"><Clock size={12} /> {sessionTime}</span>
                        </div>
                        {booking.status === "cancelled" && (
                          <div className="mt-1 text-[10px] text-red-500 font-medium">
                            <span className="font-bold uppercase mr-1">Reason:</span>
                            {booking.cancellationReason || "No reason provided"}
                            {booking.cancelledBy && (
                              <span className="text-slate-400 text-[9px] ml-2">
                                (Cancelled by {booking.cancelledBy === (typeof booking.userId === 'object' && booking.userId !== null ? (booking.userId as { id: string; name: string }).id : booking.userId) ? "Patient" : "You"})
                              </span>
                            )}
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
