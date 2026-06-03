import { motion } from "framer-motion";
import { Flame, CheckCircle2, Sparkles, Brain, Shield, Zap, Activity } from "lucide-react";
import type { DashboardData } from "../../../services/api/auth.service.ts";

const MILESTONES = [
  { title: "First Step", desc: "Initiating your journey to freedom.", icon: Sparkles, done: true, active: true },
  { title: "Consistency Peak", desc: "Maintain a 7-day streak.", icon: Flame, done: false, active: true },
  { title: "Emotional Mastery", desc: "30 days of mindful logging.", icon: Brain, done: false, active: false },
  { title: "The Guardian", desc: "Reach Level 10 of recovery.", icon: Shield, done: false, active: false },
];

interface Props {
  data: DashboardData | null;
  togglingId: string | null;
  onToggleMission: (id: string) => void;
}

export const JourneySection = ({ data, togglingId, onToggleMission }: Props) => {
  const doneMissions = data?.missions.filter((m) => m.done).length ?? 0;
  const totalMissions = data?.missions.length ?? 0;

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-mono uppercase tracking-widest"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--accent-primary)" }}>
          <Zap size={12} /> Generated Recovery System
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--fg-primary)" }}>
          Your Adaptive Recovery World
        </h2>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--fg-secondary)" }}>
          Every quest, milestone, and challenge is uniquely generated for your journey.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Milestone path (col 7) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 glass-card rounded-3xl p-8 spotlight-card"
        >
          <h3 className="font-display text-2xl font-bold mb-8" style={{ color: "var(--fg-primary)" }}>
            Journey Milestones
          </h3>
          <div className="relative">
            {/* Vertical path line */}
            <div className="absolute left-6 top-6 bottom-6 w-px path-line" />
            <div className="space-y-6">
              {MILESTONES.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative pl-16 flex items-start gap-4 ${!step.active ? "opacity-35" : ""}`}
                >
                  <div className={`milestone-node absolute left-0 ${step.done ? "done" : step.active ? "active" : "locked"}`}>
                    {step.done ? <CheckCircle2 size={18} /> : <step.icon size={18} />}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3 mb-0.5">
                      <h4 className="font-bold" style={{ color: "var(--fg-primary)" }}>{step.title}</h4>
                      {step.active && !step.done && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
                          style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--border-accent)" }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: "var(--fg-muted)" }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Daily Quests + Habits (col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Quests */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-7"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold" style={{ color: "var(--fg-primary)" }}>
                Daily Quests
              </h3>
              <span className="text-xs font-mono px-2 py-1 rounded-lg"
                style={{ background: "var(--bg-subtle)", color: "var(--fg-muted)" }}>
                {doneMissions}/{totalMissions}
              </span>
            </div>
            <div className="space-y-2.5">
              {(data?.missions ?? []).map((m) => (
                <button
                  key={m.id}
                  onClick={() => onToggleMission(m.id)}
                  disabled={togglingId === m.id}
                  className={`quest-card w-full text-left ${m.done ? "done" : ""}`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    m.done
                      ? "border-transparent text-white"
                      : "border-current"
                  }`}
                    style={{
                      background: m.done ? "var(--accent-secondary)" : "transparent",
                      color: m.done ? "white" : "var(--border-strong)",
                    }}>
                    {m.done && <CheckCircle2 size={14} />}
                  </div>
                  <span className={`flex-1 text-sm font-medium ${m.done ? "line-through" : ""}`}
                    style={{ color: m.done ? "var(--fg-muted)" : "var(--fg-primary)" }}>
                    {m.label}
                  </span>
                  <span className="text-[10px] font-mono font-bold"
                    style={{ color: "var(--accent-primary)" }}>
                    +{m.xp} XP
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Mastery Loops */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-7"
          >
            <h3 className="font-display text-xl font-bold mb-5 flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
              <Activity size={18} style={{ color: "var(--accent-primary)" }} /> Mastery Loops
            </h3>
            <div className="space-y-5">
              {(data?.habits ?? []).map((h) => (
                <div key={h.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: "var(--fg-primary)" }}>{h.label}</span>
                    <span className="text-[10px] font-bold" style={{ color: "var(--accent-secondary)" }}>
                      <Flame size={10} className="inline mr-0.5" />{h.streak}d
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {h.done.map((d, i) => (
                      <div key={i} className="flex-1 h-2.5 rounded-full transition-all"
                        style={{ backgroundColor: d ? h.color : "var(--border-subtle)" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
