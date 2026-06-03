import { useEffect, useState } from "react";
import { useAuthStore, selectAuthTherapist } from "../../store/use-auth-store.ts";
import { therapistDashboardService, type TherapistDashboardData } from "../../services/api/auth.service.ts";
import { CalendarDays, Users, Briefcase, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { useLocation } from "react-router-dom";
import { TherapistSessionsPage } from "../booking/Therapist-sessions-page.tsx";
import { AvailabilityManager } from "./components/AvailabilityManager";
import { WalletDashboard } from "./components/WalletDashboard";

export const TherapistDashboardPage = () => {
  const therapist = useAuthStore(selectAuthTherapist);
  const location = useLocation();
  const [data, setData] = useState<TherapistDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = () => {
    setLoading(true);
    therapistDashboardService
      .getDashboard()
      .then((res) => setData(res.data.data ?? null))
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load dashboard"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboard();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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

  const stats = [
    {
      label: "Sessions Today",
      value: data?.sessionsToday ?? 0,
      icon: CalendarDays,
      color: "text-brand-600",
      bg: "bg-brand-500/10",
      note: "Live dashboard active",
    },
    {
      label: "Platform Users",
      value: data?.platformUsers ?? 0,
      icon: Users,
      color: "text-sage-500",
      bg: "bg-sage-500/10",
      note: "Potential clients",
    },
    {
      label: "Experience",
      value: `${data?.experience ?? therapist?.experience ?? 0}y`,
      icon: Briefcase,
      color: "text-brand-600",
      bg: "bg-brand-500/10",
      note: "Verified expertise",
    },
    {
      label: "Days on Platform",
      value: data?.joinedDaysAgo ?? 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-500/10",
      note: "Practice duration",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 stagger-1">
        <h1 className="font-display text-2xl font-bold text-brand-900 dark:text-white mb-1">
          Welcome back, {(data?.therapistName ?? therapist?.name)?.split(" ") ?? "Doctor"} !
        </h1>
        <p className="text-brand-900/60 dark:text-slate-400 text-sm">Here's your practice overview for today.</p>
      </div>

      {/* Status Banner */}
      {data?.status === "pending" && (
        <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/25 stagger-1">
          <AlertCircle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-700">Account Pending Approval</p>
            <p className="text-xs text-yellow-600/70 mt-0.5">Your profile is under review by our admin team. You'll be notified once approved.</p>
          </div>
        </div>
      )}
      {data?.status === "approved" && (
        <div className="mb-8 stagger-1">
          <WalletDashboard
            pendingBalance={data.wallet.pendingBalance}
            availableBalance={data.wallet.availableBalance}
            withdrawnBalance={data.wallet.withdrawnBalance}
          />
        </div>
      )}

      {data?.status === "approved" && (
        <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-sage-500/10 border border-sage-500/25 stagger-1">
          <CheckCircle2 size={18} className="text-sage-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-sage-700">Account Approved & Active</p>
            <p className="text-xs text-sage-600/70 mt-0.5">You're visible to users. You can now manage incoming session requests.</p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-2">
        {stats.map(({ label, value, icon: Icon, color, bg, note }) => (
          <div key={label} className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-5 stat-card">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-display font-bold text-brand-900 dark:text-white">{value}</p>
            <p className="text-brand-900/60 dark:text-slate-400 text-xs mt-0.5">{label}</p>
            <p className="text-brand-900/30 dark:text-slate-500 text-[10px] mt-1">{note}</p>
          </div>
        ))}
      </div>

      {/* Profile Summary */}
      <div className="grid sm:grid-cols-2 gap-6 stagger-3">
        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-brand-900 dark:text-white mb-4">Your Profile</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Specializations", value: (data?.specialization ?? therapist?.specialization ?? []).join(", ") || "—" },
              { label: "Consultation Fee", value: `$${data?.consultationFee ?? therapist?.consultationFee ?? 0}` },
              { label: "Account Status", value: data?.status ?? therapist?.status ?? "pending" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <span className="text-xs text-brand-900/40 dark:text-slate-500 uppercase tracking-wider shrink-0">{label}</span>
                <span className="text-sm text-brand-900/80 dark:text-slate-300 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-50 dark:bg-white/5 border border-brand-900/10 dark:border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-brand-900 dark:text-white mb-4">Live Modules</h2>
          <div className="flex flex-col gap-3">
            {[
              "Session management dashboard",
              "Real-time request processing",
              "Client alias identity protection",
              "Secure authentication layer",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-brand-900/60 dark:text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500/40 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
