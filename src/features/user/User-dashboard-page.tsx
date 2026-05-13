import { useEffect, useState, useCallback } from "react";
import { useAuthStore, selectAuthUser } from "../../store/use-auth-store.js";
import {
  userDashboardService,
  type DashboardData,
  type ApprovedTherapist,
} from "../../services/api/auth.service.js";
import toast from "react-hot-toast";
import { TherapistDetailsModal } from "./components/Therapist-details-modal.js";
import {
  Flame, Zap, Target, Brain, Heart, PhoneCall, Star, TrendingUp,
  CheckCircle2, ChevronRight, Smile, Meh, Frown, MessageCircle,
  Shield, Clock, Award, Activity, Sparkles, BookOpen, Users, Loader2,
} from "lucide-react";

const MOOD_OPTIONS = [
  { value: "great", icon: Smile, label: "Great", color: "text-sage-600", bg: "bg-sage-500/10", border: "border-sage-500/20" },
  { value: "good", icon: Smile, label: "Good", color: "text-sage-500", bg: "bg-sage-500/5", border: "border-sage-500/10" },
  { value: "okay", icon: Meh, label: "Okay", color: "text-brand-600", bg: "bg-brand-500/10", border: "border-brand-500/20" },
  { value: "low", icon: Frown, label: "Low", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { value: "crisis", icon: Frown, label: "Crisis", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
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
  const [selectedTherapist, setSelectedTherapist] = useState<ApprovedTherapist | null>(null);

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

  const handleBookTherapist = (id: string) => {
    toast.success("Booking system coming soon!");
    setSelectedTherapist(null);
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-brand-500" />
          <p className="text-sm text-brand-900/50">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const doneMissions = data?.missions.filter((m) => m.done).length ?? 0;
  const totalMissions = data?.missions.length ?? 0;

  const STATS = [
    { label: "Days Sober", value: String(data?.streakDays ?? 0), icon: Flame, color: "text-orange-500", glow: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Current Streak", value: `${data?.streakDays ?? 0}d`, icon: Zap, color: "text-brand-600", glow: "bg-brand-500/10", border: "border-brand-500/20" },
    { label: "Sessions Done", value: String(data?.totalSessionsDone ?? 0), icon: CheckCircle2, color: "text-sage-600", glow: "bg-sage-500/10", border: "border-sage-500/20" },
    { label: "XP Earned", value: String(data?.xp ?? 0), icon: Star, color: "text-yellow-500", glow: "bg-yellow-500/10", border: "border-yellow-500/20" },
  ];

  const barHeights = data?.weekDays.map((_, i) => {
    const done = data.habits.filter((h) => h.done[i]).length;
    return data.habits.length > 0 ? Math.round((done / data.habits.length) * 90) + 10 : 20;
  }) ?? [20, 20, 20, 20, 20, 20, 20];

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8">
      <TherapistDetailsModal
        therapist={selectedTherapist}
        isOpen={!!selectedTherapist}
        onClose={() => setSelectedTherapist(null)}
        onBook={handleBookTherapist}
      />

      {/* Hero */}
      <div className="relative mb-8 stagger-1">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-mono mb-1 text-brand-900/60">{greeting}, warrior ✦</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2 text-brand-900">
              {user?.name?.split(" ")[0] ?? "Friend"},{" "}
              <span className="text-brand-600">you're doing great.</span>
            </h1>
            <p className="text-sm text-brand-900/50">Every day is a victory. Keep showing up for yourself.</p>
          </div>
          <div className="bg-surface-50 border border-brand-900/10 rounded-2xl px-5 py-4 flex-shrink-0 flex flex-col items-center gap-1 shadow-sm" style={{ minWidth: 130 }}>
            <div className="text-xs font-mono text-brand-900/60">Level</div>
            <div className="font-display text-4xl font-bold text-brand-600">{data?.level ?? 1}</div>
            <div className="w-full mt-1 h-1.5 bg-brand-900/10 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 transition-all duration-700" style={{ width: `${data?.xpPercent ?? 0}%` }} />
            </div>
            <div className="text-[10px] text-brand-900/50">{data?.xpPercent ?? 0}% to Lv.{(data?.level ?? 1) + 1}</div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 stagger-2">
        {STATS.map(({ label, value, icon: Icon, color, glow, border }) => (
          <div key={label} className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${glow} ${border}`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-brand-900">{value}</p>
              <p className="text-xs mt-0.5 text-brand-900/60">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Quick Actions */}
          <div className="stagger-2">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-3 text-brand-900/50">Quick actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Start Journey", icon: Sparkles, color: "text-brand-600", bg: "bg-brand-500/10", border: "border-brand-500/20" },
                { label: "Talk to AI", icon: Brain, color: "text-sage-600", bg: "bg-sage-500/10", border: "border-sage-500/20" },
                { label: "Book Therapist", icon: Heart, color: "text-pink-600", bg: "bg-pink-500/10", border: "border-pink-500/20" },
                { label: "Emergency", icon: Shield, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
              ].map(({ label, icon: Icon, color, bg, border }) => (
                <button key={label} className={`bg-surface-50 border ${border} ${bg} rounded-2xl flex flex-col items-center gap-2 text-center py-4 hover:shadow-sm transition-all hover:-translate-y-0.5`}>
                  <Icon size={20} className={color} />
                  <span className="text-xs font-medium text-brand-900/80">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Missions */}
          <div className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 shadow-sm stagger-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-brand-900">Daily Missions</h2>
                <p className="text-xs mt-0.5 text-brand-900/50">{doneMissions}/{totalMissions} completed</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full overflow-hidden bg-brand-900/10">
                  <div className="h-full rounded-full transition-all duration-700 bg-sage-500"
                    style={{ width: `${totalMissions ? (doneMissions / totalMissions) * 100 : 0}%` }} />
                </div>
                <Target size={16} className="text-brand-500" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {(data?.missions ?? []).map((m) => (
                <button key={m.id} onClick={() => handleToggleMission(m.id)} disabled={!!togglingId}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left w-full transition-all disabled:opacity-60 border ${
                    m.done ? "bg-sage-500/5 border-sage-500/20" : "bg-surface border-brand-900/10 hover:border-brand-900/20"
                  }`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    m.done ? "border-sage-500 bg-sage-500/20" : "border-brand-900/30"
                  }`}>
                    {togglingId === m.id ? <Loader2 size={11} className="animate-spin text-sage-600" />
                      : m.done ? <CheckCircle2 size={12} className="text-sage-600" /> : null}
                  </div>
                  <span className={`flex-1 text-sm ${m.done ? "text-brand-900/40 line-through" : "text-brand-900/80"}`}>{m.label}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full text-brand-600 bg-brand-500/10 border border-brand-500/20">+{m.xp} XP</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 shadow-sm stagger-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-brand-900">Weekly Habit Score</h2>
                <p className="text-xs mt-0.5 text-brand-900/50">Habit completion this week</p>
              </div>
              <TrendingUp size={18} className="text-sage-600" />
            </div>
            <div className="flex items-end gap-2 h-24">
              {barHeights.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-full rounded-md transition-all duration-700 hover:opacity-80 ${i === 6 ? "bg-brand-500" : "bg-brand-900/10"}`}
                    style={{ height: `${h}%`, minHeight: 4 }} />
                  <span className="text-[10px] text-brand-900/40">{WEEK_LABELS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Habit Tracker */}
          <div className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 shadow-sm stagger-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-brand-900">Habit Tracker</h2>
              <Activity size={16} className="text-brand-500" />
            </div>
            {(data?.habits ?? []).length === 0 ? (
              <p className="text-sm text-center py-4 text-brand-900/40">No habits tracked yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {(data?.habits ?? []).map(({ label, color, streak, done }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-28 flex-shrink-0">
                      <p className="text-sm font-medium text-brand-900/80">{label}</p>
                      <p className="text-[10px] text-brand-900/50">{streak}d streak</p>
                    </div>
                    <div className="flex gap-1.5 flex-1">
                      {done.map((d, i) => (
                        <div key={i} className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{ background: d ? `${color}25` : "rgba(0,0,0,0.03)", border: `1px solid ${d ? `${color}50` : "rgba(0,0,0,0.05)"}` }}>
                          {d && <div className="w-2 h-2 rounded-full" style={{ background: color }} />}
                        </div>
                      ))}
                    </div>
                    <Flame size={14} className={streak >= 7 ? "text-orange-500" : "text-brand-900/20"} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Streak */}
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-5 text-center shadow-sm stagger-2">
            <div className="text-4xl mb-2">🔥</div>
            <p className="font-display text-5xl font-bold mb-1 text-brand-900">{data?.streakDays ?? 0}</p>
            <p className="text-sm font-medium text-brand-600">Day Streak</p>
            <p className="text-xs mt-2 text-brand-900/50">Total XP: {data?.xp ?? 0}</p>
          </div>

          {/* Mood Tracker */}
          <div className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 shadow-sm stagger-3">
            <div className="flex items-center gap-2 mb-4">
              <Smile size={16} className="text-brand-500" />
              <h2 className="font-semibold text-sm text-brand-900">How are you feeling?</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {MOOD_OPTIONS.map(({ value, icon: Icon, label, color, bg, border }) => {
                const isSelected = moodSelected === value;
                return (
                  <button key={value} onClick={() => handleMood(value)} disabled={moodLogging}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl flex-1 transition-all disabled:opacity-60 border ${
                      isSelected ? `${bg} ${border} scale-105 shadow-sm` : "bg-surface hover:bg-brand-900/5 border-brand-900/10"
                    }`}>
                    <Icon size={18} className={isSelected ? color : "text-brand-900/40"} />
                    <span className={`text-[10px] ${isSelected ? "text-brand-900/80 font-medium" : "text-brand-900/50"}`}>{label}</span>
                  </button>
                );
              })}
            </div>
            {moodSelected && <p className="text-xs mt-3 text-center text-brand-600">✓ Mood logged — keep going!</p>}
          </div>

          {/* AI Companion */}
          <div className="bg-sage-500/5 border border-sage-500/20 rounded-2xl p-5 shadow-sm stagger-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage-500 shadow-md shadow-sage-500/30">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-900">Nova — AI</p>
                <p className="text-xs text-brand-900/50">Always here for you</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full animate-pulse bg-sage-500" />
            </div>
            <div className="rounded-xl p-3 mb-3 bg-surface border border-brand-900/10">
              <p className="text-xs text-brand-900/70 leading-relaxed">
                {data && data.streakDays > 0
                  ? `Amazing! You're on a ${data.streakDays}-day streak. Every step forward matters. Want to talk about today?`
                  : "Ready to start your recovery journey? I'm here to guide you. Let's begin together."}
              </p>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium hover:bg-sage-600 transition-colors bg-sage-500 text-white shadow-sm shadow-sage-500/20">
              <MessageCircle size={15} />
              Start conversation
            </button>
          </div>

          {/* Emergency */}
          <div className="bg-red-50 border border-red-500/20 rounded-2xl p-5 shadow-sm stagger-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-red-500" />
              <h2 className="text-sm font-semibold text-red-600">Emergency Support</h2>
            </div>
            <p className="text-xs mb-3 text-red-900/60">Experiencing a crisis? Reach out immediately.</p>
            <div className="flex flex-col gap-2">
              <a href="tel:9152987821" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                <PhoneCall size={14} /> iCall: 9152987821
              </a>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-surface text-brand-900/70 border border-brand-900/10 hover:bg-brand-900/5 transition-colors">
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
            <h2 className="font-semibold text-brand-900">Recommended Therapists</h2>
            <p className="text-xs mt-0.5 text-brand-900/50">
              {therapists.length > 0 ? `${therapists.length} approved specialists available` : "No therapists available yet"}
            </p>
          </div>
          <button className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 transition-colors">View all <ChevronRight size={14} /></button>
        </div>
        {therapists.length === 0 ? (
          <div className="bg-surface-50 border border-brand-900/10 rounded-2xl text-center py-8 text-brand-900/40">
            No approved therapists yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {therapists.slice(0, 4).map((t) => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTherapist(t)}
                className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-brand-900/20 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 bg-brand-500/10 text-brand-600 border border-brand-500/20">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-brand-900">{t.name}</p>
                    <p className="text-xs truncate text-brand-900/50">{t.specialization[0]}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Users size={11} className="text-brand-900/40" />
                    <span className="text-xs text-brand-900/50">{t.experience}y exp</span>
                  </div>
                  <span className="text-xs font-medium text-brand-900/70">₹{t.consultationFee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full text-sage-700 bg-sage-500/15 border border-sage-500/20">
                    <Clock size={10} className="inline mr-1" />Available
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedTherapist(t); }}
                    className="text-xs px-3 py-1 rounded-lg bg-brand-500/10 text-brand-700 hover:bg-brand-500/20 transition-colors font-medium border border-brand-500/10"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress Insights */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4 stagger-5 pb-8">
        {[
          { label: "Recovery Score", value: `${Math.min(100, (data?.xp ?? 0) > 0 ? Math.round(((doneMissions / Math.max(totalMissions, 1)) * 50) + ((data?.streakDays ?? 0) > 0 ? 50 : 0)) : 0)}%`, icon: TrendingUp, desc: "Based on missions & streak", color: "text-sage-600", bg: "bg-sage-500/10", border: "border-sage-500/20" },
          { label: "XP This Session", value: String(data?.xp ?? 0), icon: BookOpen, desc: "Total XP accumulated", color: "text-brand-600", bg: "bg-brand-500/10", border: "border-brand-500/20" },
          { label: "Therapists Available", value: String(therapists.length), icon: Users, desc: "Approved specialists", color: "text-pink-600", bg: "bg-pink-500/10", border: "border-pink-500/20" },
        ].map(({ label, value, icon: Icon, desc, color, bg, border }) => (
          <div key={label} className="bg-surface-50 border border-brand-900/10 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${border} border`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-brand-900">{value}</p>
              <p className="text-xs font-medium text-brand-900/70">{label}</p>
              <p className="text-xs text-brand-900/40">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
