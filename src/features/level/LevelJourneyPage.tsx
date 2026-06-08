import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Sparkles,
  RefreshCw,
  Trophy,
  Filter,
  ChevronRight,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";
import { useLevelGeneration } from "./hooks/useLevelGeneration.ts";
import { LevelPlayModal } from "./components/LevelPlayModal.tsx";
import { LevelOnboarding } from "./components/LevelOnboarding.tsx";
import { ForgeLoadingScreen } from "./components/ForgeLoadingScreen.tsx";
import type { Level, GenerateLevelsPayload } from "../../services/api/level.service.ts";

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";

const DIFFICULTY_DOT: Record<Level["difficulty"], string> = {
  Easy: "var(--accent-secondary)",
  Medium: "var(--accent-primary)",
  Hard: "#b89bbe",
};

export const LevelJourneyPage = () => {
  const { levels, loading, generating, fetchLevels, generateLevels, completeLevel } =
    useLevelGeneration();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [filter, setFilter] = useState<DifficultyFilter>("All");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const handleOnboardingComplete = async (payload: GenerateLevelsPayload) => {
    setShowOnboarding(false);
    await generateLevels(payload);
  };

  const activeIndex = levels.findIndex((l) => !l.isCompleted);

  const filtered =
    filter === "All" ? levels : levels.filter((l) => l.difficulty === filter);

  const totalXp = levels.reduce((sum, l) => sum + l.xp, 0);
  const completedXp = levels
    .filter((l) => l.isCompleted)
    .reduce((sum, l) => sum + l.xp, 0);
  const completedCount = levels.filter((l) => l.isCompleted).length;
  const progressPct = totalXp > 0 ? (completedXp / totalXp) * 100 : 0;

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={32}
            className="animate-spin"
            style={{ color: "var(--accent-primary)" }}
          />
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Loading your journey…
          </p>
        </div>
      </div>
    );
  }

  // ── Forging overlay ──────────────────────────────────
  if (generating) return <ForgeLoadingScreen />;

  return (
    <div
      className="min-h-full overflow-x-hidden p-6 md:p-8"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="max-w-2xl mx-auto">

        {/* ── Header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-3"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--accent-primary)",
                }}
              >
                <Sparkles size={10} />
                AI-Generated Path
              </div>
              <h1
                className="text-4xl mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--fg-primary)",
                  lineHeight: 1.05,
                }}
              >
                Your Recovery
                <br />
                <span
                  style={{ color: "var(--accent-primary)" }}
                  className="italic text-glow"
                >
                  Journey.
                </span>
              </h1>
              {levels.length > 0 && (
                <p className="text-sm mt-2" style={{ color: "var(--fg-muted)" }}>
                  {completedCount} of {levels.length} levels complete
                </p>
              )}
            </div>

            {levels.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowOnboarding(true)}
                className="btn-outline"
                style={{ width: "auto", padding: "0.6rem 1.25rem" }}
              >
                <RefreshCw size={14} />
                Regenerate
              </motion.button>
            )}
          </div>

          {/* XP progress strip */}
          {levels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 glass-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy size={16} style={{ color: "var(--accent-primary)" }} />
                  <span className="text-sm font-bold" style={{ color: "var(--fg-primary)" }}>
                    Total Progress
                  </span>
                </div>
                <span className="text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
                  {completedXp.toLocaleString()} / {totalXp.toLocaleString()} XP
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden mb-2"
                style={{ background: "var(--border-subtle)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.3 }}
                  className="xp-bar-fill h-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono" style={{ color: "var(--fg-muted)" }}>
                  {progressPct.toFixed(0)}% complete
                </span>
                {activeIndex >= 0 && (
                  <span className="text-[10px] font-mono" style={{ color: "var(--accent-primary)" }}>
                    ✦ Level {levels[activeIndex]?.level} active
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ── Empty state ─────────────────────────── */}
        {levels.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-10 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
                border: "1px solid var(--border-accent)",
              }}
            >
              <Sparkles size={32} style={{ color: "var(--accent-primary)" }} />
            </motion.div>
            <h2
              className="text-2xl mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--fg-primary)" }}
            >
              Your world hasn't been forged yet.
            </h2>
            <p
              className="text-sm mb-8 max-w-sm mx-auto"
              style={{ color: "var(--fg-muted)" }}
            >
              Answer a few questions and the AI will craft a personalized 20-level
              recovery journey built around your life.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowOnboarding(true)}
              className="btn-primary inline-flex w-auto px-8 h-14 rounded-2xl border-glow-animate"
              style={{ boxShadow: "0 12px 40px var(--accent-glow)" }}
            >
              <Sparkles size={16} />
              Start Recovery Journey
            </motion.button>
          </motion.div>
        )}

        {/* ── Level list ───────────────────────────── */}
        {levels.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {/* Filter */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <Filter size={13} style={{ color: "var(--fg-muted)" }} />
              {(["All", "Easy", "Medium", "Hard"] as DifficultyFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1 rounded-full text-xs font-mono font-medium transition-all"
                  style={{
                    background: filter === f ? "var(--accent-primary)" : "var(--bg-card)",
                    color: filter === f ? "var(--fg-on-primary)" : "var(--fg-muted)",
                    border: `1px solid ${
                      filter === f ? "var(--accent-primary)" : "var(--border-default)"
                    }`,
                  }}
                >
                  {f}
                </button>
              ))}
              <span className="ml-auto text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
                {filtered.length} levels
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5">
              {filtered.map((level, i) => {
                const isLevelActive = levels.indexOf(level) === activeIndex;
                const isLocked = !isLevelActive && !level.isCompleted;

                return (
                  <motion.button
                    key={level.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.035 }}
                    whileHover={!isLocked ? { x: 4, scale: 1.005 } : {}}
                    whileTap={!isLocked ? { scale: 0.99 } : {}}
                    onClick={() => setSelectedLevel(level)}
                    className="w-full text-left rounded-2xl p-4 transition-all"
                    style={{
                      background: level.isCompleted
                        ? "rgba(74, 107, 82, 0.05)"
                        : isLevelActive
                        ? "var(--bg-card)"
                        : "var(--bg-card)",
                      border: `1px solid ${
                        isLevelActive
                          ? "var(--border-strong)"
                          : level.isCompleted
                          ? "rgba(74, 107, 82, 0.2)"
                          : "var(--border-subtle)"
                      }`,
                      boxShadow: isLevelActive
                        ? "0 0 0 2px var(--accent-glow)"
                        : "none",
                      opacity: isLocked ? 0.5 : 1,
                      cursor: isLocked ? "default" : "pointer",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Level number */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0"
                        style={{
                          background: isLevelActive
                            ? "var(--accent-primary)"
                            : level.isCompleted
                            ? "rgba(74, 107, 82, 0.2)"
                            : "var(--bg-subtle)",
                          color: isLevelActive
                            ? "var(--fg-on-primary)"
                            : level.isCompleted
                            ? "var(--accent-secondary)"
                            : "var(--fg-muted)",
                        }}
                      >
                        {level.isCompleted ? (
                          <CheckCircle2 size={16} />
                        ) : isLocked ? (
                          <Lock size={14} />
                        ) : (
                          level.level
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            className="text-[10px] font-mono uppercase tracking-widest"
                            style={{ color: DIFFICULTY_DOT[level.difficulty] }}
                          >
                            {level.world}
                          </p>
                          {isLevelActive && (
                            <span
                              className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                              style={{
                                background: "var(--accent-glow)",
                                color: "var(--accent-primary)",
                                border: "1px solid var(--border-accent)",
                              }}
                            >
                              Active
                            </span>
                          )}
                        </div>
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--fg-primary)" }}
                        >
                          {level.objective}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className="flex items-center gap-1 text-[10px] font-mono"
                            style={{ color: "var(--fg-muted)" }}
                          >
                            <Zap size={9} style={{ color: "var(--accent-primary)" }} />
                            {level.xp} XP
                          </span>
                          <span
                            className="flex items-center gap-1 text-[10px] font-mono"
                            style={{ color: "var(--fg-muted)" }}
                          >
                            <Trophy size={9} style={{ color: "var(--accent-primary)" }} />
                            {level.reward}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      {!isLocked && (
                        <ChevronRight
                          size={16}
                          style={{ color: "var(--fg-muted)", flexShrink: 0 }}
                        />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Play modal ──────────────────────────────── */}
      <AnimatePresence>
        {selectedLevel && (
          <LevelPlayModal
            level={selectedLevel}
            isActive={levels.indexOf(selectedLevel) === activeIndex}
            onClose={() => setSelectedLevel(null)}
            onComplete={async (id) => {
              const result = await completeLevel(id);
              return result;
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Onboarding modal ────────────────────────── */}
      <AnimatePresence>
        {showOnboarding && (
          <LevelOnboarding
            onComplete={handleOnboardingComplete}
            onClose={() => setShowOnboarding(false)}
            generating={generating}
          />
        )}
      </AnimatePresence>
    </div>
  );
};