import { motion } from "framer-motion";
import { Trophy, Lock, CheckCircle2, Zap, Target } from "lucide-react";
import type { Level } from "../../../services/api/level.service.ts";

const DIFFICULTY_CONFIG = {
  Easy: {
    color: "var(--accent-secondary)",
    glow: "var(--accent-glow-secondary)",
    bg: "rgba(74, 107, 82, 0.08)",
    border: "rgba(74, 107, 82, 0.25)",
  },
  Medium: {
    color: "var(--accent-primary)",
    glow: "var(--accent-glow)",
    bg: "var(--bg-card-hover)",
    border: "var(--border-default)",
  },
  Hard: {
    color: "#b89bbe",
    glow: "rgba(184, 155, 190, 0.3)",
    bg: "rgba(107, 76, 122, 0.08)",
    border: "rgba(107, 76, 122, 0.3)",
  },
} as const;

interface Props {
  level: Level;
  index: number;
  isActive: boolean;
}

export const LevelCard = ({ level, index, isActive }: Props) => {
  const cfg = DIFFICULTY_CONFIG[level.difficulty];
  const isLocked = !isActive && !level.isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="relative rounded-2xl p-4 transition-all"
      style={{
        background: level.isCompleted
          ? "rgba(74, 107, 82, 0.06)"
          : isActive
          ? cfg.bg
          : "var(--bg-card)",
        border: `1px solid ${
          isActive ? cfg.border : "var(--border-subtle)"
        }`,
        boxShadow: isActive ? `0 0 0 3px ${cfg.glow}` : "none",
        opacity: isLocked ? 0.45 : 1,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Level number badge */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0"
            style={{
              background: isActive ? cfg.color : "var(--bg-subtle)",
              color: isActive ? "var(--fg-on-primary)" : "var(--fg-muted)",
            }}
          >
            {level.level}
          </div>
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: cfg.color }}
            >
              {level.world}
            </p>
            <p
              className="text-sm font-semibold leading-tight"
              style={{ color: "var(--fg-primary)" }}
            >
              {level.objective}
            </p>
          </div>
        </div>

        {/* Status icon */}
        <div className="shrink-0 ml-2">
          {level.isCompleted ? (
            <CheckCircle2 size={18} style={{ color: "var(--accent-secondary)" }} />
          ) : isLocked ? (
            <Lock size={16} style={{ color: "var(--fg-muted)" }} />
          ) : (
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }}
            />
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <Target size={12} style={{ color: "var(--fg-muted)" }} />
          <span className="text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
            {level.target} {level.unit}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap size={12} style={{ color: "var(--accent-primary)" }} />
          <span className="text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
            {level.xp} XP
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy size={12} style={{ color: "var(--accent-primary)" }} />
          <span className="text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
            {level.reward}
          </span>
        </div>
        {/* Difficulty pill */}
        <span
          className="ml-auto text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
          }}
        >
          {level.difficulty}
        </span>
      </div>
    </motion.div>
  );
};