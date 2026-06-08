import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trophy,
  Zap,
  Target,
  Lock,
  CheckCircle2,
  Swords,
  Clock,
  Star,
  ArrowRight,
  Shield,
} from "lucide-react";
import type { Level } from "../../../services/api/level.service.ts";

const DIFFICULTY_CONFIG = {
  Easy: {
    color: "var(--accent-secondary)",
    glow: "var(--accent-glow-secondary)",
    bg: "rgba(74, 107, 82, 0.10)",
    border: "rgba(74, 107, 82, 0.30)",
    label: "Initiate",
  },
  Medium: {
    color: "var(--accent-primary)",
    glow: "var(--accent-glow)",
    bg: "rgba(107, 76, 122, 0.10)",
    border: "var(--border-default)",
    label: "Warrior",
  },
  Hard: {
    color: "#b89bbe",
    glow: "rgba(184, 155, 190, 0.3)",
    bg: "rgba(107, 76, 122, 0.12)",
    border: "rgba(107, 76, 122, 0.35)",
    label: "Champion",
  },
} as const;

type PlayState = "preview" | "active" | "completed" | "locked";

interface Props {
  level: Level | null;
  isActive: boolean;
  onClose: () => void;
  onComplete: (levelId: string) => Promise<Level | null>;
}

export const LevelPlayModal = ({ level, isActive, onClose, onComplete }: Props) => {
  const [playState, setPlayState] = useState<PlayState>("preview");
  const [completing, setCompleting] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!level) return;
    if (level.isCompleted) {
      setPlayState("completed");
    } else if (!isActive) {
      setPlayState("locked");
    } else {
      setPlayState("preview");
    }
  }, [level, isActive]);

  // Countdown timer while quest is active
  useEffect(() => {
    if (playState === "active" && level) {
      // Timer is purely cosmetic — it gives a sense of "doing the quest now"
      // 30s countdown representing "I commit to this today"
      setTimeLeft(30);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playState, level]);

  const handleAcceptQuest = () => {
    setPlayState("active");
  };

  const handleMarkDone = async () => {
    if (!level || completing) return;
    setCompleting(true);
    const result = await onComplete(level.id);
    setCompleting(false);
    if (result) {
      setPlayState("completed");
      setTimeout(() => setXpAwarded(true), 400);
    }
  };

  if (!level) return null;

  const cfg = DIFFICULTY_CONFIG[level.difficulty];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: "rgba(7, 3, 12, 0.85)", backdropFilter: "blur(24px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full sm:max-w-md relative rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-default)",
            maxHeight: "92vh",
            overflowY: "auto",
          }}
        >
          {/* Ambient glow top */}
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${cfg.glow}, transparent)`,
              opacity: 0.4,
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl transition-all"
            style={{ color: "var(--fg-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-card-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <X size={18} />
          </button>

          <div className="relative z-10 p-6">
            {/* ── LOCKED STATE ─────────────────────── */}
            {playState === "locked" && (
              <LockedState level={level} cfg={cfg} onClose={onClose} />
            )}

            {/* ── COMPLETED STATE ───────────────────── */}
            {playState === "completed" && (
              <CompletedState
                level={level}
                cfg={cfg}
                xpAwarded={xpAwarded}
                onClose={onClose}
              />
            )}

            {/* ── PREVIEW STATE (quest board) ──────── */}
            {playState === "preview" && (
              <PreviewState
                level={level}
                cfg={cfg}
                onAccept={handleAcceptQuest}
                onClose={onClose}
              />
            )}

            {/* ── ACTIVE STATE (quest in progress) ─── */}
            {playState === "active" && (
              <ActiveState
                level={level}
                cfg={cfg}
                timeLeft={timeLeft}
                completing={completing}
                onMarkDone={handleMarkDone}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Sub-states ─────────────────────────────────────── */

const LockedState = ({
  level,
  cfg,
  onClose,
}: {
  level: Level;
  cfg: (typeof DIFFICULTY_CONFIG)[keyof typeof DIFFICULTY_CONFIG];
  onClose: () => void;
}) => (
  <div className="text-center py-4">
    <motion.div
      animate={{ rotate: [0, -5, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      <Lock size={28} style={{ color: "var(--fg-muted)" }} />
    </motion.div>
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-4"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
      }}
    >
      Level {level.level} · {level.world}
    </div>
    <h3
      className="text-2xl mb-2"
      style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
    >
      Realm Sealed
    </h3>
    <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "var(--fg-muted)" }}>
      This realm is locked. Complete the previous level to unseal it and claim its rewards.
    </p>
    <div
      className="rounded-2xl p-4 mb-6 text-left"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
    >
      <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--fg-muted)" }}>
        What awaits you
      </p>
      <p className="text-sm font-medium mb-3" style={{ color: "var(--fg-primary)" }}>
        {level.objective}
      </p>
      <div className="flex items-center gap-4">
        <StatPill icon={<Zap size={12} />} value={`${level.xp} XP`} />
        <StatPill icon={<Trophy size={12} />} value={level.reward} />
        <StatPill icon={<Target size={12} />} value={`${level.target} ${level.unit}`} />
      </div>
    </div>
    <button onClick={onClose} className="btn-outline" style={{ width: "auto", padding: "0.6rem 1.5rem" }}>
      Go back
    </button>
  </div>
);

const CompletedState = ({
  level,
  cfg,
  xpAwarded,
  onClose,
}: {
  level: Level;
  cfg: (typeof DIFFICULTY_CONFIG)[keyof typeof DIFFICULTY_CONFIG];
  xpAwarded: boolean;
  onClose: () => void;
}) => (
  <div className="text-center py-4">
    {/* Celebration burst */}
    <div className="relative w-20 h-20 mx-auto mb-6">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={xpAwarded ? { scale: [0, 1.5, 0], opacity: [1, 0.6, 0] } : {}}
          transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? cfg.color : "var(--accent-secondary)",
            top: "50%",
            left: "50%",
            transformOrigin: `${20 + i * 5}px 0px`,
            transform: `rotate(${i * 45}deg)`,
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, var(--accent-secondary), rgba(74,107,82,0.5))",
          boxShadow: "0 0 30px var(--accent-glow-secondary)",
        }}
      >
        <CheckCircle2 size={36} color="#fff" />
      </motion.div>
    </div>

    <motion.h3
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-2xl mb-1"
      style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
    >
      Quest Complete!
    </motion.h3>
    <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
      {level.world} · Level {level.level}
    </p>

    {/* XP awarded */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={xpAwarded ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.35, type: "spring", bounce: 0.4 }}
      className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-6"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 0 20px ${cfg.glow}`,
      }}
    >
      <Zap size={20} style={{ color: cfg.color }} />
      <span className="text-2xl font-bold font-mono" style={{ color: cfg.color }}>
        +{level.xp} XP
      </span>
    </motion.div>

    {/* Reward badge */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl p-4 mb-6"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
    >
      <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--fg-muted)" }}>
        Reward unlocked
      </p>
      <div className="flex items-center gap-2 justify-center">
        <Star size={16} style={{ color: cfg.color }} />
        <span className="font-semibold text-sm" style={{ color: "var(--fg-primary)" }}>
          {level.reward}
        </span>
      </div>
    </motion.div>

    <button
      onClick={onClose}
      className="btn-primary"
      style={{ borderRadius: "1rem" }}
    >
      Continue journey
      <ArrowRight size={16} />
    </button>
  </div>
);

const PreviewState = ({
  level,
  cfg,
  onAccept,
  onClose,
}: {
  level: Level;
  cfg: (typeof DIFFICULTY_CONFIG)[keyof typeof DIFFICULTY_CONFIG];
  onAccept: () => void;
  onClose: () => void;
}) => (
  <div>
    {/* World badge */}
    <div className="flex items-center justify-between mb-5">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest"
        style={{
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          color: cfg.color,
        }}
      >
        <Shield size={10} />
        {level.world}
      </div>
      <span
        className="text-xs font-mono px-2 py-0.5 rounded-full"
        style={{
          background: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.border}`,
        }}
      >
        {cfg.label} · {level.difficulty}
      </span>
    </div>

    {/* Level number + title */}
    <div className="mb-5">
      <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "var(--fg-muted)" }}>
        Level {level.level}
      </p>
      <h3
        className="text-2xl leading-tight"
        style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
      >
        {level.objective}
      </h3>
    </div>

    {/* Stats */}
    <div
      className="grid grid-cols-3 gap-2 mb-5 p-4 rounded-2xl"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
    >
      <StatBlock
        icon={<Target size={16} style={{ color: cfg.color }} />}
        label="Target"
        value={`${level.target} ${level.unit}`}
      />
      <StatBlock
        icon={<Zap size={16} style={{ color: cfg.color }} />}
        label="Reward"
        value={`${level.xp} XP`}
      />
      <StatBlock
        icon={<Trophy size={16} style={{ color: cfg.color }} />}
        label="Badge"
        value={level.reward}
      />
    </div>

    {/* Unlock requirement */}
    {level.unlockRequirement !== "None" && (
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <Lock size={12} style={{ color: "var(--fg-muted)" }} />
        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
          {level.unlockRequirement}
        </span>
      </div>
    )}

    {/* What this means in practice */}
    <div
      className="rounded-2xl p-4 mb-6"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: cfg.color }}>
        Your quest
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
        Complete <strong style={{ color: "var(--fg-primary)" }}>{level.objective}</strong> for{" "}
        <strong style={{ color: "var(--fg-primary)" }}>
          {level.target} {level.unit}
        </strong>
        . Mark it done when you've completed today's commitment.
      </p>
    </div>

    {/* CTA */}
    <div className="flex gap-3">
      <button
        onClick={onClose}
        className="btn-outline"
        style={{ width: "auto", padding: "0.75rem 1.25rem" }}
      >
        Later
      </button>
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAccept}
        className="btn-primary"
        style={{ boxShadow: `0 8px 24px ${cfg.glow}` }}
      >
        <Swords size={16} />
        Accept Quest
      </motion.button>
    </div>
  </div>
);

const ActiveState = ({
  level,
  cfg,
  timeLeft,
  completing,
  onMarkDone,
}: {
  level: Level;
  cfg: (typeof DIFFICULTY_CONFIG)[keyof typeof DIFFICULTY_CONFIG];
  timeLeft: number;
  completing: boolean;
  onMarkDone: () => void;
}) => {
  const committed = timeLeft === 0;

  return (
    <div className="text-center py-2">
      {/* Animated quest active ring */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="4"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke={cfg.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
            animate={{
              strokeDashoffset:
                timeLeft === 0
                  ? 0
                  : 2 * Math.PI * 40 * (timeLeft / 30),
            }}
            transition={{ duration: 0.5 }}
            style={{ filter: `drop-shadow(0 0 6px ${cfg.color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {committed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <Swords size={28} style={{ color: cfg.color }} />
            </motion.div>
          ) : (
            <div className="text-center">
              <p className="text-lg font-bold font-mono" style={{ color: cfg.color }}>
                {timeLeft}
              </p>
              <p className="text-[9px] font-mono uppercase" style={{ color: "var(--fg-muted)" }}>
                sec
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-4"
        style={{
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          color: cfg.color,
        }}
      >
        <Clock size={10} />
        Quest active · {level.world}
      </div>

      <h3
        className="text-2xl mb-2 leading-tight"
        style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
      >
        {level.objective}
      </h3>
      <p className="text-sm mb-2" style={{ color: "var(--fg-muted)" }}>
        Target:{" "}
        <strong style={{ color: "var(--fg-primary)" }}>
          {level.target} {level.unit}
        </strong>
      </p>

      {/* Commitment message */}
      <AnimatePresence mode="wait">
        {!committed ? (
          <motion.p
            key="committing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs mb-8 max-w-xs mx-auto"
            style={{ color: "var(--fg-muted)" }}
          >
            Read your quest carefully. You can mark it complete once you've committed.
          </motion.p>
        ) : (
          <motion.p
            key="committed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm mb-8 font-medium max-w-xs mx-auto"
            style={{ color: cfg.color }}
          >
            ✦ You're committed. Complete your quest and mark it done.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Mark done */}
      <motion.button
        whileHover={committed ? { scale: 1.04, y: -3 } : {}}
        whileTap={committed ? { scale: 0.97 } : {}}
        onClick={committed ? onMarkDone : undefined}
        disabled={!committed || completing}
        className="btn-primary w-full"
        style={{
          borderRadius: "1rem",
          opacity: committed ? 1 : 0.4,
          boxShadow: committed ? `0 8px 24px ${cfg.glow}` : "none",
          cursor: committed ? "pointer" : "not-allowed",
          transition: "all 0.3s ease",
        }}
      >
        {completing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap size={16} />
            </motion.div>
            Claiming XP…
          </>
        ) : (
          <>
            <CheckCircle2 size={16} />
            Mark Quest Complete
          </>
        )}
      </motion.button>
    </div>
  );
};

/* ─── Shared primitives ──────────────────────────────── */

const StatBlock = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col items-center gap-1.5 text-center">
    {icon}
    <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>
      {label}
    </p>
    <p className="text-xs font-semibold leading-tight" style={{ color: "var(--fg-primary)" }}>
      {value}
    </p>
  </div>
);

const StatPill = ({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) => (
  <div
    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono"
    style={{
      background: "var(--bg-subtle)",
      color: "var(--fg-muted)",
      border: "1px solid var(--border-subtle)",
    }}
  >
    <span style={{ color: "var(--accent-primary)" }}>{icon}</span>
    {value}
  </div>
);