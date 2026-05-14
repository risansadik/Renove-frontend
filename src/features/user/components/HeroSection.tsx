import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Brain, Trophy, Shield, Star } from "lucide-react";
import type { DashboardData } from "../../../services/api/auth.service.js";

const HOW_IT_WORKS = [
  { icon: Brain, label: "AI Analyzes You", desc: "Habits, triggers & patterns" },
  { icon: Zap, label: "World Generated", desc: "A path built for your life" },
  { icon: Star, label: "Daily Quests", desc: "Adapt as you grow" },
  { icon: Trophy, label: "Level Up", desc: "Real progress, real rewards" },
  { icon: Shield, label: "Expert Guides", desc: "AI + human accountability" },
];

const ORB_POSITIONS = [
  { top: "10%", left: "5%", size: 300, delay: 0 },
  { top: "60%", right: "5%", size: 250, delay: 2 },
  { top: "30%", left: "40%", size: 180, delay: 1 },
];

interface Props {
  data: DashboardData | null;
  isNew: boolean;
  greeting: string;
}

export const HeroSection = ({ data, isNew, greeting }: Props) => (
  <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-24 overflow-hidden">

    {/* Ambient background orbs */}
    {ORB_POSITIONS.map((o, i) => (
      <motion.div
        key={i}
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 8 + i * 2, repeat: Infinity, delay: o.delay }}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: o.size,
          height: o.size,
          background: i === 1
            ? "radial-gradient(circle, rgba(74,107,82,0.4), transparent 70%)"
            : "radial-gradient(circle, rgba(107,76,122,0.4), transparent 70%)",
          filter: "blur(40px)",
          top: o.top,
          left: (o as any).left,
          right: (o as any).right,
        }}
      />
    ))}

    {/* Floating particles */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + (i % 3) * 2, repeat: Infinity, delay: i * 0.4 }}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 4),
            height: 3 + (i % 4),
            background: i % 2 === 0 ? "var(--accent-primary)" : "var(--accent-secondary)",
            left: `${8 + i * 7}%`,
            top: `${15 + (i * 13) % 65}%`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>

    {/* Main content */}
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      {/* Greeting badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-mono uppercase tracking-widest"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-strong)",
          color: "var(--accent-primary)",
        }}
      >
        <Sparkles size={12} />
        {greeting} — Your recovery universe awaits
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="cinematic-headline mb-6"
        style={{ color: "var(--fg-primary)" }}
      >
        {isNew ? (
          <>
            An AI path to freedom<br />
            <span style={{ color: "var(--accent-primary)" }} className="italic text-glow">
              built just for you.
            </span>
          </>
        ) : (
          <>
            Your recovery world<br />
            <span style={{ color: "var(--accent-primary)" }} className="italic text-glow">
              is evolving.
            </span>
          </>
        )}
      </motion.h1>

      {/* Sub text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg max-w-2xl mx-auto mb-4 leading-relaxed"
        style={{ color: "var(--fg-secondary)" }}
      >
        reNove analyzes your habits, triggers, emotional patterns, and recovery goals to generate a
        personalized progression system designed specifically for your healing journey.
      </motion.p>

      {isNew ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base mb-10 font-medium"
          style={{ color: "var(--accent-primary)" }}
        >
          ✦ Your first step is the most powerful. Begin the journey that was made for you.
        </motion.p>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-base mb-10 font-medium"
          style={{ color: "var(--accent-secondary)" }}
        >
          ✦ {data?.streakDays ?? 0} days strong. Your AI is adapting your path right now.
        </motion.p>
      )}

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.04, y: -3 }}
        whileTap={{ scale: 0.97 }}
        className="btn-primary inline-flex w-auto px-10 h-16 text-base rounded-2xl border-glow-animate"
        style={{ fontSize: "1rem", boxShadow: "0 12px 40px var(--accent-glow)" }}
      >
        {isNew ? "Begin Your Recovery Journey" : "Continue Recovery Journey"}
        <ArrowRight size={20} />
      </motion.button>

      {/* How it works pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-3 mt-14"
      >
        {HOW_IT_WORKS.map(({ icon: Icon, label, desc }, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, scale: 1.03 }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl glass-card text-sm"
          >
            <Icon size={16} style={{ color: "var(--accent-primary)" }} />
            <div className="text-left">
              <p className="font-semibold text-xs" style={{ color: "var(--fg-primary)" }}>{label}</p>
              <p className="text-[10px]" style={{ color: "var(--fg-muted)" }}>{desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* XP / Level preview strip */}
    {!isNew && (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 mt-16 glass-card rounded-3xl p-6 max-w-xl mx-auto w-full"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} style={{ color: "var(--accent-primary)" }} />
            <span className="text-sm font-bold" style={{ color: "var(--fg-primary)" }}>
              Level {data?.level ?? 1} — The Path of Resurgence
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
            {data?.xp ?? 0} XP
          </span>
        </div>
        <div className="h-2 rounded-full" style={{ background: "var(--border-subtle)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data?.xpPercent ?? 0}%` }}
            transition={{ duration: 1.5, ease: "circOut", delay: 1 }}
            className="xp-bar-fill h-full"
          />
        </div>
        <p className="text-[10px] mt-2 font-mono" style={{ color: "var(--fg-muted)" }}>
          {100 - (data?.xpPercent ?? 0)}% to next level
        </p>
      </motion.div>
    )}
  </section>
);
