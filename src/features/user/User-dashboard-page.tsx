import { useEffect, useState, useCallback } from "react";
import { useAuthStore, selectAuthUser } from "../../store/use-auth-store.js";
import {
  userDashboardService,
  type DashboardData,
  type ApprovedTherapist,
} from "../../services/api/auth.service.js";
import toast from "react-hot-toast";
import {
  Flame, Zap, Target, Brain, Heart, PhoneCall, Star, TrendingUp,
  CheckCircle2, ChevronRight, Smile, Meh, Frown, MessageCircle,
  Shield, Clock, Award, Activity, Sparkles, BookOpen, Users, Loader2,
} from "lucide-react";

const MOOD_OPTIONS = [
  { value: "great", icon: Smile, label: "Great", color: "#4a6b52" },
  { value: "good", icon: Smile, label: "Good", color: "#9bb89e" },
  { value: "okay", icon: Meh, label: "Okay", color: "#b89bbe" },
  { value: "low", icon: Frown, label: "Low", color: "#f97316" },
  { value: "crisis", icon: Frown, label: "Crisis", color: "#ef4444" },
] as const;

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export const UserDashboardPage = () => {
  const user = useAuthStore(selectAuthUser);
  const [data, setData] = useState<DashboardData | null>(null);
  const [therapists, setTherapists] = useState<ApprovedTherapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [moodSelected, setMoodSelected] = useState<string | null>(null);
  const [moodLogging, setMoodLogging] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const fetchDashboard = useCallback(async () => {
    try {
      const [dashRes, therapistRes] = await Promise.all([
        userDashboardService.getDashboard(),
        userDashboardService.getTherapists(),
      ]);
      setData(dashRes.data.data ?? null);
      setTherapists(therapistRes.data.data ?? []);
      const lastMood = dashRes.data.data?.recentMoods?.slice(-1)[0]?.mood ?? null;
      setMoodSelected(lastMood);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleMood = async (mood: string) => {
    if (moodLogging) return;
    setMoodSelected(mood);
    setMoodLogging(true);
    try {
      await userDashboardService.logMood(mood);
      toast.success("Mood logged!");
      await fetchDashboard();
    } catch { setMoodSelected(null); } finally { setMoodLogging(false); }
  };

  const handleToggleMission = async (missionId: string) => {
    if (togglingId) return;
    setTogglingId(missionId);
    try {
      const res = await userDashboardService.toggleMission(missionId);
      if (res.data.data) setData((prev) => prev ? { ...prev, missions: res.data.data!.missions } : prev);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update mission");
    } finally { setTogglingId(null); }
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ color: "#e8e6f0" }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin" style={{ color: "#b89bbe" }} />
          <p className="text-sm" style={{ color: "rgba(232,230,240,0.5)" }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const doneMissions = data?.missions.filter((m) => m.done).length ?? 0;
  const totalMissions = data?.missions.length ?? 0;

  const STATS = [
    { label: "Days Sober", value: String(data?.streakDays ?? 0), icon: Flame, color: "#f97316", glow: "rgba(249,115,22,0.2)" },
    { label: "Current Streak", value: `${data?.streakDays ?? 0}d`, icon: Zap, color: "#b89bbe", glow: "rgba(184,155,190,0.2)" },
    { label: "Sessions Done", value: String(data?.totalSessionsDone ?? 0), icon: CheckCircle2, color: "#4a6b52", glow: "rgba(74,107,82,0.2)" },
    { label: "XP Earned", value: String(data?.xp ?? 0), icon: Star, color: "#f59e0b", glow: "rgba(245,158,11,0.2)" },
  ];

  // Build bar heights from habit completion over the week
  const barHeights = data?.weekDays.map((_, i) => {
    const done = data.habits.filter((h) => h.done[i]).length;
    return data.habits.length > 0 ? Math.round((done / data.habits.length) * 90) + 10 : 20;
  }) ?? [20, 20, 20, 20, 20, 20, 20];

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8" style={{ color: "#e8e6f0" }}>

      {/* Hero */}
      <div className="relative mb-8 stagger-1">
        <div className="absolute -top-8 -left-8 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(107,76,122,0.18) 0%, transparent 70%)" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: "rgba(184,155,190,0.7)" }}>{greeting}, warrior ✦</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2" style={{ color: "#e8e6f0" }}>
              {user?.name?.split(" ")[0] ?? "Friend"},{" "}
              <span className="gradient-text">you're doing great.</span>
            </h1>
            <p className="text-sm" style={{ color: "rgba(232,230,240,0.5)" }}>Every day is a victory. Keep showing up for yourself.</p>
          </div>
          <div className="glass-card px-5 py-4 flex-shrink-0 flex flex-col items-center gap-1" style={{ minWidth: 130 }}>
            <div className="text-xs font-mono" style={{ color: "rgba(184,155,190,0.6)" }}>Level</div>
            <div className="font-display text-4xl font-bold gradient-text">{data?.level ?? 1}</div>
            <div className="w-full mt-1 progress-track">
              <div className="progress-fill" style={{ width: `${data?.xpPercent ?? 0}%` }} />
            </div>
            <div className="text-[10px]" style={{ color: "rgba(184,155,190,0.5)" }}>{data?.xpPercent ?? 0}% to Lv.{(data?.level ?? 1) + 1}</div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 stagger-2">
        {STATS.map(({ label, value, icon: Icon, color, glow }) => (
          <div key={label} className="dash-card flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: glow, border: `1px solid ${color}30` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="font-display text-2xl font-bold" style={{ color: "#e8e6f0" }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(232,230,240,0.45)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Quick Actions */}
          <div className="stagger-2">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "rgba(184,155,190,0.5)" }}>Quick actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Start Journey", icon: Sparkles, color: "#b89bbe", bg: "rgba(107,76,122,0.2)", border: "rgba(184,155,190,0.2)" },
                { label: "Talk to AI", icon: Brain, color: "#9bb89e", bg: "rgba(74,107,82,0.15)", border: "rgba(155,184,158,0.2)" },
                { label: "Book Therapist", icon: Heart, color: "#c4a8d0", bg: "rgba(196,168,208,0.1)", border: "rgba(196,168,208,0.2)" },
                { label: "Emergency", icon: Shield, color: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
              ].map(({ label, icon: Icon, color, bg, border }) => (
                <button key={label} className="dash-card flex flex-col items-center gap-2 cursor-pointer text-center py-4" style={{ background: bg, borderColor: border }}>
                  <Icon size={20} style={{ color }} />
                  <span className="text-xs font-medium" style={{ color: "rgba(232,230,240,0.8)" }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Missions */}
          <div className="dash-card stagger-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold" style={{ color: "#e8e6f0" }}>Daily Missions</h2>
                <p className="text-xs mt-0.5" style={{ color: "rgba(232,230,240,0.4)" }}>{doneMissions}/{totalMissions} completed</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${totalMissions ? (doneMissions / totalMissions) * 100 : 0}%`, background: "linear-gradient(to right, #4a6b52, #9bb89e)" }} />
                </div>
                <Target size={16} style={{ color: "#b89bbe" }} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {(data?.missions ?? []).map((m) => (
                <button key={m.id} onClick={() => handleToggleMission(m.id)} disabled={!!togglingId}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-left w-full transition-all disabled:opacity-60"
                  style={{ background: m.done ? "rgba(74,107,82,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${m.done ? "rgba(74,107,82,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                  <div className={`mission-check${m.done ? " done" : ""}`}>
                    {togglingId === m.id ? <Loader2 size={11} className="animate-spin" style={{ color: "#4a6b52" }} />
                      : m.done ? <CheckCircle2 size={12} style={{ color: "#4a6b52" }} /> : null}
                  </div>
                  <span className="flex-1 text-sm" style={{ color: m.done ? "rgba(232,230,240,0.4)" : "rgba(232,230,240,0.85)", textDecoration: m.done ? "line-through" : "none" }}>{m.label}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: "#b89bbe", background: "rgba(107,76,122,0.15)", border: "1px solid rgba(184,155,190,0.15)" }}>+{m.xp} XP</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="dash-card stagger-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold" style={{ color: "#e8e6f0" }}>Weekly Habit Score</h2>
                <p className="text-xs mt-0.5" style={{ color: "rgba(232,230,240,0.4)" }}>Habit completion this week</p>
              </div>
              <TrendingUp size={18} style={{ color: "#4a6b52" }} />
            </div>
            <div className="flex items-end gap-2 h-24">
              {barHeights.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-md transition-all duration-700 hover:opacity-80"
                    style={{ height: `${h}%`, background: i === 6 ? "linear-gradient(to top, #6b4c7a, #b89bbe)" : "rgba(184,155,190,0.2)", minHeight: 4 }} />
                  <span className="text-[10px]" style={{ color: "rgba(232,230,240,0.3)" }}>{WEEK_LABELS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Habit Tracker */}
          <div className="dash-card stagger-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ color: "#e8e6f0" }}>Habit Tracker</h2>
              <Activity size={16} style={{ color: "#b89bbe" }} />
            </div>
            {(data?.habits ?? []).length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: "rgba(232,230,240,0.3)" }}>No habits tracked yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {(data?.habits ?? []).map(({ label, color, streak, done }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-28 flex-shrink-0">
                      <p className="text-sm font-medium" style={{ color: "rgba(232,230,240,0.8)" }}>{label}</p>
                      <p className="text-[10px]" style={{ color: "rgba(232,230,240,0.35)" }}>{streak}d streak</p>
                    </div>
                    <div className="flex gap-1.5 flex-1">
                      {done.map((d, i) => (
                        <div key={i} className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{ background: d ? `${color}25` : "rgba(255,255,255,0.05)", border: `1px solid ${d ? `${color}50` : "rgba(255,255,255,0.06)"}` }}>
                          {d && <div className="w-2 h-2 rounded-full" style={{ background: color }} />}
                        </div>
                      ))}
                    </div>
                    <Flame size={14} style={{ color: streak >= 7 ? "#f97316" : "rgba(232,230,240,0.2)" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Streak */}
          <div className="dash-card text-center stagger-2" style={{ background: "linear-gradient(135deg, rgba(107,76,122,0.2), rgba(184,155,190,0.08))" }}>
            <div className="text-4xl mb-2">🔥</div>
            <p className="font-display text-5xl font-bold mb-1" style={{ color: "#e8e6f0" }}>{data?.streakDays ?? 0}</p>
            <p className="text-sm font-medium" style={{ color: "#b89bbe" }}>Day Streak</p>
            <p className="text-xs mt-2" style={{ color: "rgba(232,230,240,0.4)" }}>Total XP: {data?.xp ?? 0}</p>
          </div>

          {/* Mood Tracker */}
          <div className="dash-card stagger-3">
            <div className="flex items-center gap-2 mb-4">
              <Smile size={16} style={{ color: "#b89bbe" }} />
              <h2 className="font-semibold text-sm" style={{ color: "#e8e6f0" }}>How are you feeling?</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {MOOD_OPTIONS.map(({ value, icon: Icon, label, color }) => (
                <button key={value} onClick={() => handleMood(value)} disabled={moodLogging}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl flex-1 transition-all disabled:opacity-60"
                  style={{ background: moodSelected === value ? `${color}20` : "rgba(255,255,255,0.04)", border: `1px solid ${moodSelected === value ? `${color}50` : "rgba(255,255,255,0.06)"}`, transform: moodSelected === value ? "scale(1.05)" : "scale(1)" }}>
                  <Icon size={18} style={{ color }} />
                  <span className="text-[10px]" style={{ color: "rgba(232,230,240,0.6)" }}>{label}</span>
                </button>
              ))}
            </div>
            {moodSelected && <p className="text-xs mt-3 text-center" style={{ color: "rgba(184,155,190,0.7)" }}>✓ Mood logged — keep going!</p>}
          </div>

          {/* AI Companion */}
          <div className="dash-card stagger-3" style={{ background: "linear-gradient(135deg, rgba(74,107,82,0.1), rgba(155,184,158,0.05))" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4a6b52, #9bb89e)", boxShadow: "0 0 20px rgba(74,107,82,0.4)" }}>
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#e8e6f0" }}>Nova — AI Companion</p>
                <p className="text-xs" style={{ color: "rgba(232,230,240,0.4)" }}>Always here for you</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: "#4a6b52" }} />
            </div>
            <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs" style={{ color: "rgba(232,230,240,0.7)" }}>
                {data && data.streakDays > 0
                  ? `Amazing! You're on a ${data.streakDays}-day streak. Every step forward matters. Want to talk about today?`
                  : "Ready to start your recovery journey? I'm here to guide you. Let's begin together."}
              </p>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #4a6b52, #9bb89e)", color: "white" }}>
              <MessageCircle size={15} />
              Start conversation
            </button>
          </div>

          {/* Emergency */}
          <div className="dash-card stagger-4" style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} style={{ color: "#f87171" }} />
              <h2 className="text-sm font-semibold" style={{ color: "#f87171" }}>Emergency Support</h2>
            </div>
            <p className="text-xs mb-3" style={{ color: "rgba(232,230,240,0.5)" }}>Experiencing a crisis? Reach out immediately.</p>
            <div className="flex flex-col gap-2">
              <a href="tel:9152987821" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                <PhoneCall size={14} /> iCall: 9152987821
              </a>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(232,230,240,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <MessageCircle size={14} /> Talk to Nova (AI)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Therapists */}
      <div className="mt-6 stagger-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold" style={{ color: "#e8e6f0" }}>Recommended Therapists</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(232,230,240,0.4)" }}>
              {therapists.length > 0 ? `${therapists.length} approved specialists available` : "No therapists available yet"}
            </p>
          </div>
          <button className="flex items-center gap-1 text-xs" style={{ color: "#b89bbe" }}>View all <ChevronRight size={14} /></button>
        </div>
        {therapists.length === 0 ? (
          <div className="dash-card text-center py-8" style={{ color: "rgba(232,230,240,0.3)" }}>
            No approved therapists yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {therapists.slice(0, 4).map((t) => (
              <div key={t.id} className="dash-card flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(107,76,122,0.4), rgba(184,155,190,0.2))", color: "#b89bbe", border: "1px solid rgba(184,155,190,0.25)" }}>
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#e8e6f0" }}>{t.name}</p>
                    <p className="text-xs truncate" style={{ color: "rgba(232,230,240,0.4)" }}>{t.specialization[0]}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Users size={11} style={{ color: "rgba(232,230,240,0.35)" }} />
                    <span className="text-xs" style={{ color: "rgba(232,230,240,0.35)" }}>{t.experience}y exp</span>
                  </div>
                  <span className="text-xs" style={{ color: "rgba(232,230,240,0.5)" }}>₹{t.consultationFee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: "#4a6b52", background: "rgba(74,107,82,0.15)", border: "1px solid rgba(74,107,82,0.2)" }}>
                    <Clock size={10} className="inline mr-1" />Available
                  </span>
                  <button className="text-xs px-3 py-1 rounded-lg" style={{ background: "rgba(107,76,122,0.25)", color: "#b89bbe", border: "1px solid rgba(184,155,190,0.2)" }}>Book</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Insights */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4 stagger-5 pb-8">
        {[
          { label: "Recovery Score", value: `${Math.min(100, (data?.xp ?? 0) > 0 ? Math.round(((doneMissions / Math.max(totalMissions, 1)) * 50) + ((data?.streakDays ?? 0) > 0 ? 50 : 0)) : 0)}%`, icon: TrendingUp, desc: "Based on missions & streak", color: "#4a6b52" },
          { label: "XP This Session", value: String(data?.xp ?? 0), icon: BookOpen, desc: "Total XP accumulated", color: "#b89bbe" },
          { label: "Therapists Available", value: String(therapists.length), icon: Users, desc: "Approved specialists", color: "#9bb89e" },
        ].map(({ label, value, icon: Icon, desc, color }) => (
          <div key={label} className="dash-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon size={22} style={{ color }} />
            </div>
            <div>
              <p className="font-display text-2xl font-bold" style={{ color: "#e8e6f0" }}>{value}</p>
              <p className="text-xs font-medium" style={{ color: "rgba(232,230,240,0.7)" }}>{label}</p>
              <p className="text-xs" style={{ color: "rgba(232,230,240,0.35)" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
