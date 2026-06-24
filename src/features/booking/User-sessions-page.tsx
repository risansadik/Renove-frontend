import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Video, CheckCircle2, XCircle, Timer, AlertCircle, MoreVertical, CreditCard, X } from "lucide-react";
import bookingService, { type BookingResponse } from "../../services/api/booking.service";
import paymentService from "../../services/api/payment.service";
import { StripePaymentWrapper } from "./components/StripePaymentWrapper";
import { CheckoutForm } from "./components/CheckoutForm";
import { PaymentTimer } from "./components/PaymentTimer";
import { CancellationModal } from "./components/CancellationModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const UserSessionsPage = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentBreakdown, setPaymentBreakdown] = useState<{
    consultationFee: number;
    commissionPercentage: number;
    platformFee: number;
    amount: number;
  } | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingResponse | null>(null);
  const navigate = useNavigate();

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchBookings = async (p: number, l: number) => {
    setIsLoading(true);
    try {
      const response = await bookingService.getUserBookings(p, l);
      setBookings(response.data);
      if (response.meta) {
        setTotalPages(response.meta.totalPages);
        setPage(response.meta.page);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings(page, limit);
    }, 0);
    return () => clearTimeout(timer);
  }, [page, limit]);

  const handlePayNow = async (booking: BookingResponse) => {
    try {
      setSelectedBooking(booking);
      const res = await paymentService.createPaymentIntent(booking.id);
      setClientSecret(res.data.clientSecret);
      setPaymentBreakdown({
        consultationFee: res.data.consultationFee ?? (typeof booking.therapistId === 'object' ? booking.therapistId.consultationFee : 0),
        commissionPercentage: res.data.commissionPercentage ?? 0,
        platformFee: res.data.platformFee ?? 0,
        amount: res.data.amount,
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to initialize payment";
      toast.error(msg);
      setSelectedBooking(null);
      setClientSecret(null);
      setPaymentBreakdown(null);
    }
  };

  const handleCancelBooking = async (reason: string) => {
    if (!bookingToCancel) return;
    try {
      const loadingToast = toast.loading("Cancelling appointment...");
      await bookingService.cancelBooking(bookingToCancel.id, reason);
      toast.success("Appointment cancelled successfully", { id: loadingToast });
      fetchBookings(page, limit);
    } finally {
      setIsCancelModalOpen(false);
      setBookingToCancel(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
      awaiting_payment: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      completed: "bg-brand-500/10 text-brand-500 border-brand-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
      expired: "bg-slate-500/10 text-slate-500 border-slate-500/20",
      no_show: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Timer size={14} />;
      case "accepted": return <CheckCircle2 size={14} />;
      case "awaiting_payment": return <CreditCard size={14} />;
      case "confirmed": return <CheckCircle2 size={14} />;
      case "rejected": return <XCircle size={14} />;
      case "cancelled": return <XCircle size={14} />;
      case "no_show": return <XCircle size={14} />;
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
            const rawTherapistName = typeof booking.therapistId === 'object' ? booking.therapistId.name : 'Therapist';
            const therapistName = rawTherapistName.startsWith("Dr. ") ? rawTherapistName : `Dr. ${rawTherapistName}`;
            const sessionDate = typeof booking.slotId === 'object' ? new Date(booking.slotId.startTime) : new Date(booking.createdAt);
            const now = new Date();
            const sessionStartTime =
              typeof booking.slotId === "object" && booking.slotId.startTime
                ? new Date(booking.slotId.startTime)
                : now;
            const hasReachedStartTime = now >= sessionStartTime;

            let sessionTime = "Scheduled";
            let durationText = "60 Minutes";
            if (typeof booking.slotId === 'object') {
              const start = new Date(booking.slotId.startTime);
              const end = new Date(booking.slotId.endTime);
              sessionTime = `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;
              const diffMs = end.getTime() - start.getTime();
              durationText = `${Math.round(diffMs / 60000)} Minutes`;
            }

            const requestedDate = format(new Date(booking.createdAt), "MMM d, yyyy 'at' hh:mm a");

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
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-1">
                      <span className="flex items-center gap-1"><Clock size={14} /> {sessionTime}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{durationText}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Requested on {requestedDate}
                    </div>

                    {booking.status === "rejected" && booking.rejectionReason && (
                      <div className="mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-[10px] text-red-500 font-medium">
                        <span className="font-bold uppercase mr-1">Reason:</span>
                        {booking.rejectionReason}
                      </div>
                    )}

                    {booking.status === "cancelled" && (
                      <div className="mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-[10px] text-red-500 font-medium space-y-1">
                        <div>
                          <span className="font-bold uppercase mr-1">Cancelled by:</span>
                          {booking.cancelledBy === (typeof booking.userId === 'object' ? (booking.userId as { id: string }).id : booking.userId) ? "You" : "Therapist"}
                        </div>
                        {booking.cancellationReason && (
                          <div>
                            <span className="font-bold uppercase mr-1">Reason:</span>
                            {booking.cancellationReason}
                          </div>
                        )}
                        {booking.cancelledAt && (
                          <div className="text-[9px] text-slate-400">
                            Cancelled on {format(new Date(booking.cancelledAt), "MMM d, yyyy h:mm a")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                  {booking.status === "awaiting_payment" && (
                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <PaymentTimer
                        updatedAt={booking.updatedAt}
                        onExpire={() => fetchBookings(page, limit)}
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handlePayNow(booking)}
                          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                        >
                          <CreditCard size={16} />
                          Pay Now
                        </button>
                        {!hasReachedStartTime && (
                          <button
                            onClick={() => {
                              setBookingToCancel(booking);
                              setIsCancelModalOpen(true);
                            }}
                            className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/25 text-red-500 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {(booking.status === "accepted" || booking.status === "confirmed") && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {hasReachedStartTime ? (
                        <button
                          onClick={() => navigate(`/dashboard/session/${booking.id}`)}
                          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-transform flex items-center gap-2"
                        >
                          <Video size={14} />
                          Join Session
                        </button>
                      ) : (
                        <div className="px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-500 font-bold text-[10px] border border-amber-500/20 flex items-center gap-2">
                          <Clock size={12} />
                          Upcoming
                        </div>
                      )}
                      {!hasReachedStartTime && (
                        <button
                          onClick={() => {
                            setBookingToCancel(booking);
                            setIsCancelModalOpen(true);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/25 text-red-500 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                  {booking.status === "pending" && (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {!hasReachedStartTime && (
                        <button
                          onClick={() => {
                            setBookingToCancel(booking);
                            setIsCancelModalOpen(true);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-500/25 text-red-500 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center justify-center"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                  {booking.status !== "awaiting_payment" && booking.status !== "accepted" && booking.status !== "confirmed" && booking.status !== "pending" && (
                    <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-brand-500 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
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

      {/* Payment Modal */}
      {selectedBooking && clientSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto relative bg-[#100818] rounded-4xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 custom-scrollbar">
            <button
              onClick={() => { setSelectedBooking(null); setClientSecret(null); setPaymentBreakdown(null); }}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <StripePaymentWrapper clientSecret={clientSecret}>
                <CheckoutForm
                  amount={paymentBreakdown?.amount ?? (typeof selectedBooking.therapistId === 'object' ? selectedBooking.therapistId.consultationFee : 0)}
                  consultationFee={paymentBreakdown?.consultationFee}
                  platformFee={paymentBreakdown?.platformFee}
                  commissionPercentage={paymentBreakdown?.commissionPercentage}
                  bookingId={selectedBooking.id}
                  onSuccess={() => {
                    toast.success("Payment successful!");
                    setSelectedBooking(null);
                    setClientSecret(null);
                    setPaymentBreakdown(null);
                    fetchBookings(page, limit);
                  }}
                />
              </StripePaymentWrapper>
            </div>
          </div>
        </div>
      )}

      <CancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setBookingToCancel(null);
        }}
        onConfirm={handleCancelBooking}
        booking={bookingToCancel}
      />
    </div>
  );
};
