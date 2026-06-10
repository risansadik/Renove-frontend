import { motion } from "framer-motion";
import { Flame, Star, Award, Heart, Smile, Meh, Frown, Shield, Target, Clock } from "lucide-react";
import type { DashboardData } from "../../../services/api/auth.service.ts";

const MOOD_OPTIONS = [
  { value: "great", icon: Smile, label: "Great" },
  { value: "good", icon: Smile, label: "Good" },
  { value: "okay", icon: Meh, label: "Okay" },
  { value: "low", icon: Frown, label: "Low" },
  { value: "crisis", icon: Frown, label: "Crisis" },
] as const;

interface Props {
  data: DashboardData | null;
  moodSelected: string | null;
  moodLogging: boolean;
  onMood: (m: string) => void;
}

export const ProgressSection = ({ data, moodSelected, moodLogging, onMood }: Props) => {
  const doneMissions = data?.missions.filter((m) => m.done).length ?? 0;
  const totalMissions = data?.missions.length ?? 0;
  const streakDays = data?.streakDays ?? 0;

  const STATS = [
    { label: "Day Streak", value: streakDays, icon: Flame, accent: "#f97316" },
    { label: "Total XP", value: data?.xp ?? 0, icon: Star, accent: "#eab308" },
    { label: "Missions", value: `${doneMissions}/${totalMissions}`, icon: Target, accent: "var(--accent-primary)" },
    { label: "Sessions", value: data?.totalSessionsDone ?? 0, icon: Clock, accent: "var(--accent-secondary)" },
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--fg-primary)" }}>
          Your Recovery Universe
        </h2>
        <p style={{ color: "var(--fg-secondary)" }}>Evolving with every step you take.</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map(({ label, value, icon: Icon, accent }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
              <Icon size={22} style={{ color: accent }} className={label === "Day Streak" ? "streak-flame-flicker" : ""} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>{value}</p>
              <p className="text-[10px] uppercase tracking-widest font-mono" style={{ color: "var(--fg-muted)" }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Emotional Pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-7"
        >
          <h3 className="font-display text-xl font-bold mb-5 flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
            <Heart size={18} style={{ color: "var(--accent-primary)" }} /> Emotional Pulse
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {MOOD_OPTIONS.map(({ value, icon: Icon, label }) => {
              const sel = moodSelected === value;
              return (
                <button
                  key={value}
                  onClick={() => onMood(value)}
                  disabled={moodLogging}
                  title={label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all hover:scale-110"
                  style={{
                    background: sel ? "var(--accent-glow)" : "var(--bg-card)",
                    border: `1px solid ${sel ? "var(--border-accent)" : "var(--border-subtle)"}`,
                    transform: sel ? "scale(1.1)" : "scale(1)",
                    boxShadow: sel ? "0 4px 12px var(--accent-glow)" : "none",
                  }}
                >
                  <Icon size={20} style={{ color: sel ? "var(--accent-primary)" : "var(--fg-muted)" }} />
                  <span className="text-[8px] font-mono" style={{ color: sel ? "var(--accent-primary)" : "var(--fg-muted)" }}>{label}</span>
                </button>
              );
            })}
          </div>
          {moodSelected && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-center py-2 rounded-xl"
              style={{ background: "var(--accent-glow)", color: "var(--accent-primary)" }}
            >
              Nova has updated your journey path.
            </motion.p>
          )}
        </motion.div>

        {/* Achievement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-7 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f59e0b20, #f59e0b40)", border: "2px solid #f59e0b40" }}
          >
            <Award size={36} className="text-yellow-500" />
          </motion.div>
          <h3 className="font-bold mb-1" style={{ color: "var(--fg-primary)" }}>Upcoming Badge</h3>
          <p className="text-xs mb-5" style={{ color: "var(--fg-muted)" }}>
            "The Resilient One" - 10 Day Streak
          </p>
          <div className="h-2 rounded-full mb-2" style={{ background: "var(--border-subtle)" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, (streakDays / 10) * 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full rounded-full bg-yellow-500"
              style={{ boxShadow: "0 0 8px rgba(234, 179, 8, 0.4)" }}
            />
          </div>
          <p className="text-[10px] font-mono" style={{ color: "var(--fg-muted)" }}>
            {streakDays}/10 days
          </p>
        </motion.div>

        {/* Emergency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl p-7 flex flex-col"
          style={{ borderColor: "rgba(239, 68, 68, 0.2)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>Safe Space</span>
          </div>
          <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--fg-secondary)" }}>
            Feeling overwhelmed? Access immediate human support or AI intervention instantly.
          </p>
          <button
            className="w-full h-12 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-xl"
            style={{ background: "linear-gradient(135deg, #dc2626, #ef4444)", boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)" }}
          >
            Activate Emergency Help
          </button>
        </motion.div>
      </div>
    </section>
  );
};
