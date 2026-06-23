import { AnimatePresence, motion } from "framer-motion";
import { Flame, Star, Award, Heart, Shield, Target, Clock, Phone, MapPin } from "lucide-react";
import { MOOD_OPTIONS, type ProgressSectionProps } from "../types/user-dashboard.types";

export const ProgressSection = ({
  data,
  moodSelected,
  moodLogging,
  onMood,
  emergencyOpen,
  setEmergencyOpen,
  openNearestTherapist,
}: ProgressSectionProps) => {
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
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
            >
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
                  <span className="text-[8px] font-mono" style={{ color: sel ? "var(--accent-primary)" : "var(--fg-muted)" }}>
                    {label}
                  </span>
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
        <>
          <AnimatePresence>
            {emergencyOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
                onClick={() => setEmergencyOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 20, stiffness: 260 }}
                  className="glass-card rounded-3xl p-8 w-full max-w-sm flex flex-col gap-4"
                  style={{
                    border: "1px solid rgba(239,68,68,0.35)",
                    boxShadow: "0 0 40px rgba(220,38,38,0.2)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm font-bold uppercase tracking-widest text-red-400">
                        Emergency Help
                      </span>
                    </div>
                    <button
                      onClick={() => setEmergencyOpen(false)}
                      className="text-xs px-2 py-1 rounded-lg"
                      style={{ color: "var(--fg-muted)", background: "var(--bg-card)" }}
                    >
                      ✕ Close
                    </button>
                  </div>

                  <p className="text-xs leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
                    You're not alone. Reach out right now - a real person is ready to help.
                  </p>

                  {/* Crisis Hotline — tap to call */}
                  <a
                    href="tel:+919152987821"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #ef4444)",
                      boxShadow: "0 4px 20px rgba(220,38,38,0.35)",
                    }}
                  >
                    <Phone size={17} />
                    <span>Call iCall Crisis Line</span>
                    <span className="ml-auto font-mono text-xs opacity-80">9152987821</span>
                  </a>

                  {/* Nearest mental health help via Google Maps */}
                  <button
                    onClick={openNearestTherapist}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "var(--fg-primary)",
                    }}
                  >
                    <MapPin size={17} className="text-red-400" />
                    <span>Find Nearest Support Center</span>
                  </button>

                  <p className="text-[10px] text-center font-mono" style={{ color: "var(--fg-muted)" }}>
                    iCall is a NIMHANS-affiliated crisis helpline · India
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>
                Safe Space
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--fg-secondary)" }}>
              Feeling overwhelmed? Access immediate human support or AI intervention instantly.
            </p>
            <button
              onClick={() => setEmergencyOpen(true)}
              className="w-full h-12 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #dc2626, #ef4444)",
                boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)",
              }}
            >
              Activate Emergency Help
            </button>
          </motion.div>
        </>
      </div>
    </section>
  );
};