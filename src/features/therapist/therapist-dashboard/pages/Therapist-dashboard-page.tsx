import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CalendarDays, CheckCircle2, Clock, DollarSign, Loader2, Star, Users } from "lucide-react";
import { useTherapistDashboard } from "../hooks/use-therapist-dashboard";
import { TherapistSessionsPage } from "../../../booking/Therapist-sessions-page";
import { AvailabilityManager } from "../components/Availability-manager";
import { money } from "../types/therapist-dashboard.types";
import { StatCard } from "../components/Stat-card";
import { TodaySchedule } from "../components/Today-schedule";
import { PendingRequests } from "../components/Pending-requests";
import { EarningsChart } from "../components/Earnings-chart";
import { SessionTrendChart } from "../components/Session-trend-chart";
import { StatusDistributionChart } from "../components/Status-distribution-chart";
import { RecentActivity } from "../components/Recent-activity";
import { ClientInsights } from "../components/Client-insights";

export const TherapistDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    therapist,
    data,
    availabilityRules,
    reviews,
    loading,
    actionId,
    handleStatusUpdate,
    overview,
  } = useTherapistDashboard();

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-brand-600" />
      </div>
    );
  }

  if (location.pathname.endsWith("/sessions")) {
    return <div className="p-6 md:p-8"><TherapistSessionsPage /></div>;
  }

  if (location.pathname.endsWith("/availability")) {
    return <div className="p-6 md:p-8"><AvailabilityManager /></div>;
  }

  const averageRating = data?.averageRating ?? therapist?.averageRating ?? 0;
  const totalRatings = data?.totalRatings ?? therapist?.totalRatings ?? 0;

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

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Today's schedule + pending requests */}
      <section className="grid xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <TodaySchedule
          bookings={overview.todayBookings}
          onNavigateToSessions={() => navigate("/therapist/sessions")}
          onNavigateToSessionRoom={(id) => navigate(`/therapist/session/${id}`)}
        />
        <PendingRequests
          bookings={overview.pendingBookings}
          actionId={actionId}
          onStatusUpdate={handleStatusUpdate}
        />
      </section>

      {/* Earnings Hero Chart */}
      <EarningsChart
        earningsTrend={overview.earningsTrend}
        thisMonthCredits={overview.thisMonthCredits}
        thisYearCredits={overview.thisYearCredits}
        availableBalance={overview.availableBalance}
        pendingPayouts={overview.pendingPayouts}
        totalWithdrawn={overview.totalWithdrawn}
        totalRefunds={overview.totalRefunds}
      />

      {/* Analytics Group */}
      <section className="grid xl:grid-cols-[1fr_0.85fr] gap-6">
        <SessionTrendChart completedBookings={overview.completedBookings} getSessionStart={(booking) => typeof booking.slotId === "object" && booking.slotId.startTime ? new Date(booking.slotId.startTime) : new Date(booking.createdAt)} />
        <StatusDistributionChart values={overview.statusDistribution} />
      </section>

      {/* Bottom Information Grid */}
      <section className="grid xl:grid-cols-3 gap-6">
        <RecentActivity activity={overview.activity} />

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

        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6 flex flex-col">
          <h2 className="font-semibold text-brand-900 dark:text-white mb-5">Reviews Snapshot</h2>

          {/* Summary row */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Star size={28} fill="currentColor" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                {averageRating > 0 ? averageRating.toFixed(1) : "New"}
              </p>
              <p className="text-xs text-slate-400">{totalRatings} total ratings</p>
            </div>
          </div>

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="rounded-2xl p-4 bg-white dark:bg-white/5 text-sm text-slate-500 dark:text-slate-400">
              No written reviews yet. Reviews appear here after clients leave comments on completed sessions.
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-28 pr-1">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl p-3 bg-white dark:bg-white/5 border border-brand-900/10 dark:border-white/10 flex flex-col gap-1.5 shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {review.userName[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {review.userName}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          fill={s <= review.rating ? "#f59e0b" : "none"}
                          className={s <= review.rating ? "text-amber-500" : "text-slate-300 dark:text-slate-600"}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Client Insights Layer */}
      <section className="grid xl:grid-cols-1 gap-6">
        <ClientInsights
          activeClients={overview.activeClients}
          newClients={overview.newClients}
          returningClientCount={overview.returningClientCount}
          completedCount={overview.completedCount}
        />
      </section>
    </div>
  );
};