import { motion } from "framer-motion";
import { Star, Clock, Target, BookOpen, Heart, TrendingUp, Award } from "lucide-react";
import { MILESTONES, MOOD_OPTIONS, type JourneyOverviewTabProps } from "../types/user-progress.types.ts";

export const JourneyOverviewTab = ({
  data,
  bookings,
  goals,
  journals,
  totalSessionsDone,
  completedGoalsCount,
  moodSelected,
  moodLogging,
  stats,
  handleMoodLog,
}: JourneyOverviewTabProps) => {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <Star size={20} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>LVL {data?.level ?? 1}</p>
            <p className="text-[10px] uppercase font-mono tracking-wider" style={{ color: "var(--fg-muted)" }}>Level</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center gap-4" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <Clock size={20} className="text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>{totalSessionsDone}</p>
            <p className="text-[10px] uppercase font-mono tracking-wider" style={{ color: "var(--fg-muted)" }}>Sessions Finished</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center gap-4" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <Target size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>{completedGoalsCount}/{goals.length}</p>
            <p className="text-[10px] uppercase font-mono tracking-wider" style={{ color: "var(--fg-muted)" }}>Goals Done</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center gap-4" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <BookOpen size={20} className="text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>{journals.length}</p>
            <p className="text-[10px] uppercase font-mono tracking-wider" style={{ color: "var(--fg-muted)" }}>Journals Logged</p>
          </div>
        </div>
      </div>

      {/* Level progress bar */}
      {data && (
        <div className="p-6 rounded-2xl space-y-3" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span style={{ color: "var(--fg-primary)" }}>XP Progress</span>
            <span style={{ color: "var(--accent-primary)" }}>{data.xp} XP / {data.level * 100} XP</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${data.xpPercent}%`,
                background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))"
              }}
            />
          </div>
          <p className="text-xs" style={{ color: "var(--fg-muted)" }}>Complete daily missions or logs to earn more XP and level up!</p>
        </div>
      )}

      {/* Mood log Pulse check */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood picker card */}
        <div className="p-6 rounded-2xl space-y-5" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
          <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
            <Heart size={18} className="text-red-400" />
            <span>How are you feeling right now?</span>
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {MOOD_OPTIONS.map(({ value, icon: Icon, label, color, bg }) => {
              const isSel = moodSelected === value;
              return (
                <button
                  key={value}
                  onClick={() => handleMoodLog(value)}
                  disabled={moodLogging}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: isSel ? bg : "var(--bg-base)",
                    border: `1px solid ${isSel ? color : "var(--border-default)"}`,
                  }}
                >
                  <Icon size={22} style={{ color: isSel ? color : "var(--fg-muted)" }} />
                  <span className="text-[10px] font-medium" style={{ color: isSel ? color : "var(--fg-muted)" }}>{label}</span>
                </button>
              );
            })}
          </div>
          {moodSelected && (
            <p className="text-xs text-center py-2 rounded-xl" style={{ background: "var(--accent-glow)", color: "var(--accent-primary)" }}>
              Nova has logged your mood: <strong className="capitalize">{moodSelected}</strong>
            </p>
          )}
        </div>

        {/* Session statistics widget */}
        <div className="p-6 rounded-2xl space-y-4" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
          <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
            <TrendingUp size={18} className="text-indigo-400" />
            <span>Sessions Performance</span>
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl" style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)" }}>
              <p className="text-xl font-bold" style={{ color: "var(--fg-primary)" }}>{bookings.length}</p>
              <p className="text-[9px] uppercase font-semibold text-slate-400 mt-1">Booked</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)" }}>
              <p className="text-xl font-bold text-green-500">{bookings.filter(b => b.status === "completed").length}</p>
              <p className="text-[9px] uppercase font-semibold text-slate-400 mt-1">Completed</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)" }}>
              <p className="text-xl font-bold text-yellow-500">{bookings.filter(b => b.status === "confirmed" || b.status === "pending").length}</p>
              <p className="text-[9px] uppercase font-semibold text-slate-400 mt-1">Active</p>
            </div>
          </div>
          {bookings.length > 0 ? (
            <p className="text-[11px]" style={{ color: "var(--fg-muted)" }}>
              Your attendance rate is <strong className="text-green-500">{Math.round((bookings.filter(b => b.status === "completed").length / bookings.length) * 100)}%</strong>. Keep it up!
            </p>
          ) : (
            <p className="text-[11px]" style={{ color: "var(--fg-muted)" }}>No booked sessions found yet.</p>
          )}
        </div>
      </div>

      {/* Badges and Milestones Section */}
      <div className="p-6 rounded-2xl space-y-6" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
        <div className="flex items-center gap-2">
          <Award size={20} className="text-yellow-500" />
          <h3 className="font-bold text-lg" style={{ color: "var(--fg-primary)" }}>Milestone Badges</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {MILESTONES.map((badge) => {
            const unlocked = badge.check(stats);
            const BadgeIcon = badge.icon;
            return (
              <div
                key={badge.id}
                className="p-4 rounded-xl flex flex-col items-center text-center transition-all relative overflow-hidden group"
                style={{
                  background: unlocked ? "var(--bg-base)" : "rgba(148, 163, 184, 0.03)",
                  border: `1px solid ${unlocked ? "var(--border-default)" : "rgba(148, 163, 184, 0.1)"}`,
                  opacity: unlocked ? 1 : 0.5,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{
                    background: unlocked ? badge.color : "var(--border-subtle)",
                    color: unlocked ? "#fff" : "var(--fg-muted)",
                    boxShadow: unlocked ? "0 4px 14px rgba(0, 0, 0, 0.15)" : "none",
                  }}
                >
                  <BadgeIcon size={20} />
                </div>
                <p className="text-xs font-bold" style={{ color: unlocked ? "var(--fg-primary)" : "var(--fg-muted)" }}>{badge.title}</p>
                <p className="text-[9px] mt-1 leading-tight" style={{ color: "var(--fg-muted)" }}>{badge.description}</p>
                {unlocked && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};