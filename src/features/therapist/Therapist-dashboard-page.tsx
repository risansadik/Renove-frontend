import { useEffect, useMemo, useState } from "react";
import { format, isSameDay, parseISO, startOfMonth, startOfYear } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  Star,
  UserCheck,
  Users,
  Video,
  X,
} from "lucide-react";
import { useAuthStore, selectAuthTherapist } from "../../store/use-auth-store.ts";
import { therapistDashboardService, type TherapistDashboardData } from "../../services/api/auth.service.ts";
import bookingService, { type BookingResponse } from "../../services/api/booking.service.ts";
import walletService, { type Transaction } from "../../services/api/wallet.service.ts";
import availabilityService, { type AvailabilityRule } from "../../services/api/availability.service.ts";
import { TherapistSessionsPage } from "../booking/Therapist-sessions-page.tsx";
import { AvailabilityManager } from "./components/AvailabilityManager";
import { SessionTrendChart } from "./components/SessionTrendChart";
import { StatusDistributionChart, type StatusGroup } from "../therapist/components/Statusdistributionchart.tsx";
import { EarningsChart } from "../therapist/components/Earningschart.tsx";
import type { LucideIcon } from "lucide-react";

const getClientName = (booking: BookingResponse) =>
  typeof booking.userId === "object" && booking.userId !== null
    ? booking.userId.name
    : `Client #${String(booking.userId).slice(-4)}`;

const getSessionStart = (booking: BookingResponse) =>
  typeof booking.slotId === "object" && booking.slotId.startTime
    ? parseISO(booking.slotId.startTime)
    : parseISO(booking.createdAt);

const getSessionEnd = (booking: BookingResponse) =>
  typeof booking.slotId === "object" && booking.slotId.endTime
    ? parseISO(booking.slotId.endTime)
    : getSessionStart(booking);

const formatSessionTime = (booking: BookingResponse) => {
  const start = getSessionStart(booking);
  const end = getSessionEnd(booking);
  return `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;
};

const isUpcomingStatus = (status: BookingResponse["status"]) =>
  ["accepted", "awaiting_payment", "confirmed"].includes(status);

const getStatusGroup = (status: BookingResponse["status"]): StatusGroup => {
  if (status === "completed") return "completed";
  if (status === "cancelled" || status === "rejected" || status === "expired") return "cancelled";
  if (status === "no_show") return "missed";
  return "upcoming";
};

const money = (value: number) => `$${Math.round(value).toLocaleString()}`;

export const TherapistDashboardPage = () => {
  const therapist = useAuthStore(selectAuthTherapist);
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<TherapistDashboardData | null>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availabilityRules, setAvailabilityRules] = useState<AvailabilityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashboardRes, bookingsRes, walletRes, availabilityRes] = await Promise.all([
        therapistDashboardService.getDashboard(),
        bookingService.getTherapistBookings(1, 100),
        walletService.getWalletData(1, 20),
        availabilityService.getMyAvailabilityRules(),
      ]);

      setData(dashboardRes.data.data ?? null);
      setBookings(bookingsRes.data ?? []);
      setTransactions(walletRes.data?.transactions ?? []);
      setAvailabilityRules(availabilityRes.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboard();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusUpdate = async (bookingId: string, status: "awaiting_payment" | "rejected") => {
    setActionId(bookingId);
    try {
      await bookingService.updateBookingStatus(bookingId, status, status === "rejected" ? "Declined from dashboard" : undefined);
      toast.success(status === "rejected" ? "Booking declined" : "Booking accepted");
      await fetchDashboard();
    } finally {
      setActionId(null);
    }
  };

  const overview = useMemo(() => {
    const now = new Date();
    const todayBookings = bookings
      .filter((booking) => isSameDay(getSessionStart(booking), now))
      .sort((a, b) => getSessionStart(a).getTime() - getSessionStart(b).getTime());
    const upcomingBookings = bookings.filter((booking) => isUpcomingStatus(booking.status) && getSessionStart(booking) >= startOfMonth(now));
    const pendingBookings = bookings.filter((booking) => booking.status === "pending");
    const completedBookings = bookings.filter((booking) => booking.status === "completed");
    const activeClientIds = new Set(bookings.filter((booking) => ["confirmed", "completed", "awaiting_payment"].includes(booking.status)).map((booking) => typeof booking.userId === "object" ? booking.userId.id : booking.userId));
    const newClientIds = new Set(bookings.filter((booking) => getSessionStart(booking) >= startOfMonth(now)).map((booking) => typeof booking.userId === "object" ? booking.userId.id : booking.userId));
    const returningClientCount = [...activeClientIds].filter((clientId) => bookings.filter((booking) => (typeof booking.userId === "object" ? booking.userId.id : booking.userId) === clientId).length > 1).length;
    const thisMonthCredits = transactions.filter((tx) => tx.type === "credit" && parseISO(tx.createdAt) >= startOfMonth(now)).reduce((sum, tx) => sum + tx.amount, 0);
    const thisYearCredits = transactions.filter((tx) => tx.type === "credit" && parseISO(tx.createdAt) >= startOfYear(now)).reduce((sum, tx) => sum + tx.amount, 0);
    const totalRefunds = transactions.filter((tx) => tx.type === "debit" && tx.description?.toLowerCase().includes("refund")).reduce((sum, tx) => sum + tx.amount, 0);
    const totalWithdrawn = transactions.filter((tx) => tx.type === "debit" && tx.description?.toLowerCase().includes("withdraw")).reduce((sum, tx) => sum + tx.amount, 0);
    const statusDistribution = bookings.reduce<Record<StatusGroup, number>>(
      (acc, booking) => ({ ...acc, [getStatusGroup(booking.status)]: acc[getStatusGroup(booking.status)] + 1 }),
      { completed: 0, upcoming: 0, cancelled: 0, missed: 0 }
    );
    const earningsTrend = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        label: format(date, "MMM"),
        value: transactions
          .filter((tx) => tx.type === "credit")
          .filter((tx) => {
            const txDate = parseISO(tx.createdAt);
            return txDate.getFullYear() === date.getFullYear() && txDate.getMonth() === date.getMonth();
          })
          .reduce((sum, tx) => sum + tx.amount, 0),
      };
    });
    const activity = [
      ...bookings.slice(0, 8).map((booking) => ({
        id: `booking-${booking.id}`,
        label: `${getClientName(booking)} ${booking.status.replace("_", " ")} session`,
        date: parseISO(booking.updatedAt ?? booking.createdAt),
      })),
      ...transactions.slice(0, 6).map((tx) => ({
        id: `tx-${tx.id}`,
        label: `${tx.type === "credit" ? "Payment credited" : "Wallet debit"}: ${tx.description}`,
        date: parseISO(tx.createdAt),
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8);

    return {
      todayBookings,
      upcomingBookings,
      pendingBookings,
      completedBookings,
      activeClients: activeClientIds.size,
      newClients: newClientIds.size,
      returningClientCount,
      completedCount: completedBookings.length,
      thisMonthCredits,
      thisYearCredits,
      pendingPayouts: data?.wallet.pendingBalance ?? 0,
      availableBalance: data?.wallet.availableBalance ?? 0,
      totalWithdrawn,
      totalRefunds,
      statusDistribution,
      earningsTrend,
      activity,
    };
  }, [bookings, transactions, data?.wallet.pendingBalance]);

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-brand-600" />
      </div>
    );
  }

  const isSessionsView = location.pathname.endsWith("/sessions");
  const isAvailabilityView = location.pathname.endsWith("/availability");

  if (isSessionsView) {
    return (
      <div className="p-6 md:p-8">
        <TherapistSessionsPage />
      </div>
    );
  }

  if (isAvailabilityView) {
    return (
      <div className="p-6 md:p-8">
        <AvailabilityManager />
      </div>
    );
  }

  const averageRating = therapist?.averageRating ?? 0;
  const totalRatings = therapist?.totalRatings ?? 0;
  const stats = [
    { label: "Today's Sessions", value: overview.todayBookings.length, icon: CalendarDays, tone: "text-brand-600 bg-brand-500/10" },
    { label: "Upcoming Sessions", value: overview.upcomingBookings.length, icon: Clock, tone: "text-indigo-600 bg-indigo-500/10" },
    { label: "Active Clients", value: overview.activeClients, icon: Users, tone: "text-sage-600 bg-sage-500/10" },
    { label: "Monthly Earnings", value: money(overview.thisMonthCredits), icon: DollarSign, tone: "text-emerald-600 bg-emerald-500/10" },
    { label: "Average Rating", value: averageRating > 0 ? averageRating.toFixed(1) : "New", icon: Star, tone: "text-amber-600 bg-amber-500/10" },
    { label: "Pending Requests", value: overview.pendingBookings.length, icon: AlertCircle, tone: "text-rose-600 bg-rose-500/10" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-900 dark:text-white mb-1">
            Welcome back, Dr. {data?.therapistName ?? therapist?.name ?? "Doctor"}
          </h1>
          <p className="text-brand-900/60 dark:text-slate-400 text-sm">Your practice overview for {format(new Date(), "EEEE, MMMM d")}.</p>
        </div>
        {data?.status === "approved" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sage-500/10 border border-sage-500/25 text-sage-700 text-xs font-semibold">
            <CheckCircle2 size={15} /> Account active and visible
          </div>
        )}
      </div>

      {data?.status === "pending" && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/25">
          <AlertCircle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-700">Account Pending Approval</p>
            <p className="text-xs text-yellow-600/70 mt-0.5">Your profile is under review by our admin team.</p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${tone}`}>
              <Icon size={17} />
            </div>
            <p className="text-2xl font-display font-bold text-brand-900 dark:text-white">{value}</p>
            <p className="text-brand-900/60 dark:text-slate-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Today's schedule + pending requests */}
      <section className="grid xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-semibold text-brand-900 dark:text-white">Today's Schedule</h2>
              <p className="text-xs text-brand-900/50 dark:text-slate-500">Sessions ordered by time</p>
            </div>
            <button onClick={() => navigate("/therapist/sessions")} className="text-xs font-bold text-brand-600 hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {overview.todayBookings.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                No sessions scheduled for today.
              </div>
            ) : (
              overview.todayBookings.map((booking) => {
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
                      <button onClick={() => navigate("/therapist/sessions")} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200">View Details</button>
                      {readyToJoin && (
                        <button onClick={() => navigate(`/therapist/session/${booking.id}`)} className="px-3 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold flex items-center gap-1.5">
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

        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Pending Booking Requests</h2>
          <div className="space-y-3">
            {overview.pendingBookings.slice(0, 4).map((booking) => (
              <div key={booking.id} className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <div className="flex justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{getClientName(booking)}</p>
                    <p className="text-xs text-slate-400">{format(getSessionStart(booking), "MMM d")} at {formatSessionTime(booking)}</p>
                  </div>
                  <Clock size={16} className="text-amber-500 shrink-0" />
                </div>
                <div className="flex gap-2">
                  <button disabled={actionId === booking.id} onClick={() => handleStatusUpdate(booking.id, "rejected")} className="flex-1 h-9 rounded-xl border border-red-500/20 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50">
                    <X size={13} /> Decline
                  </button>
                  <button disabled={actionId === booking.id} onClick={() => handleStatusUpdate(booking.id, "awaiting_payment")} className="flex-1 h-9 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50">
                    <Check size={13} /> Accept
                  </button>
                </div>
              </div>
            ))}
            {overview.pendingBookings.length === 0 && <p className="text-sm text-slate-400 py-8 text-center">No booking requests waiting.</p>}
          </div>
        </div>
      </section>

      {/* Earnings — hero chart, full width */}
      <EarningsChart
        earningsTrend={overview.earningsTrend}
        thisMonthCredits={overview.thisMonthCredits}
        thisYearCredits={overview.thisYearCredits}
        availableBalance={overview.availableBalance}
        pendingPayouts={overview.pendingPayouts}
        totalWithdrawn={overview.totalWithdrawn}
        totalRefunds={overview.totalRefunds}
      />

      {/* Session analytics + status distribution */}
      <section className="grid xl:grid-cols-[1fr_0.85fr] gap-6">
        <SessionTrendChart completedBookings={overview.completedBookings} getSessionStart={getSessionStart} />
        <StatusDistributionChart values={overview.statusDistribution} />
      </section>

      {/* Recent activity */}
      <section className="grid xl:grid-cols-3 gap-6">
        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6 xl:col-span-1">
          <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Recent Activity</h2>
          <div className="space-y-3">
            {overview.activity.map((item) => (
              <div key={item.id} className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{item.label}</p>
                  <p className="text-[10px] text-slate-400">{format(item.date, "MMM d, hh:mm a")}</p>
                </div>
              </div>
            ))}
            {overview.activity.length === 0 && <p className="text-sm text-slate-400">No recent activity yet.</p>}
          </div>
        </div>

        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Availability Summary</h2>
          <div className="space-y-3">
            {availabilityRules.slice(0, 4).map((rule) => (
              <div key={rule.id} className="flex items-center justify-between gap-3 rounded-xl p-3 bg-white dark:bg-white/5">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{rule.title}</p>
                  <p className="text-xs text-slate-400">{rule.recurrenceType}</p>
                </div>
                <p className="text-xs font-bold text-brand-600">{rule.startTime} - {rule.endTime}</p>
              </div>
            ))}
            {availabilityRules.length === 0 && <p className="text-sm text-slate-400 py-8 text-center">No availability rules configured.</p>}
          </div>
        </div>

        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Reviews Snapshot</h2>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star size={28} fill="currentColor" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">{averageRating > 0 ? averageRating.toFixed(1) : "New"}</p>
              <p className="text-xs text-slate-400">{totalRatings} total reviews</p>
            </div>
          </div>
          <div className="rounded-2xl p-4 bg-white dark:bg-white/5 text-sm text-slate-500 dark:text-slate-400">
            Client review text is not collected yet. Your rating average will update as eligible clients submit stars after completed sessions.
          </div>
        </div>
      </section>

      {/* Client insights */}
      <section className="grid xl:grid-cols-1 gap-6">
        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Client Insights</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              ["Active", overview.activeClients, UserCheck],
              ["New This Month", overview.newClients, Users],
              ["Returning", overview.returningClientCount, CheckCircle2],
              ["Total Sessions", overview.completedCount, CalendarDays],
            ] as [string, number, LucideIcon][]).map(([label, value, Icon]) => (
              <div key={String(label)} className="rounded-xl p-3 bg-white dark:bg-white/5">
                <Icon size={16} className="text-brand-500 mb-2" />
                <p className="text-xl font-bold text-slate-900 dark:text-white">{String(value)}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400">{String(label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
