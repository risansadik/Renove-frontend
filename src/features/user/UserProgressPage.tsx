import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Star, Award, Heart,
  Plus, Trash2, BookOpen, TrendingUp, Search, X, CheckCircle, Circle,
  Clock,
  Target,
} from "lucide-react";
import { MILESTONES, MOOD_OPTIONS } from "../../domain/model/index.ts";
import { useUserProgress } from "./hooks/useUserProgress.ts";

export const UserProgressPage = () => {

  const {
    data,
    bookings,
    loading,

    activeTab,
    setActiveTab,

    journals,
    newJournalTitle,
    setNewJournalTitle,
    newJournalContent,
    setNewJournalContent,
    newJournalMood,
    setNewJournalMood,
    journalSearch,
    setJournalSearch,
    selectedJournal,
    setSelectedJournal,

    goals,
    newGoalText,
    setNewGoalText,
    newGoalCategory,
    setNewGoalCategory,
    newGoalDate,
    setNewGoalDate,

    moodSelected,
    moodLogging,

    totalSessionsDone,
    completedGoalsCount,
    stats,
    filteredJournals,

    handleMoodLog,
    handleCreateJournal,
    handleDeleteJournal,
    handleCreateGoal,
    handleToggleGoal,
    handleDeleteGoal,
  } = useUserProgress();


  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Clock size={32} className="animate-spin text-purple-400" />
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Analyzing your growth path…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold" style={{ color: "var(--fg-primary)" }}>Progress & Growth</h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>Explore your statistics, mental pulse, goals, and milestones.</p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold"
          style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", borderColor: "var(--border-accent)" }}
        >
          <Flame size={14} className="text-orange-500 streak-flame-flicker" />
          <span>{data?.streakDays ?? 0} Day Streak</span>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b mb-8 gap-2" style={{ borderColor: "var(--border-subtle)" }}>
        {(["overview", "journal", "goals"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-[2px]"
            style={{
              borderColor: activeTab === tab ? "var(--accent-primary)" : "transparent",
              color: activeTab === tab ? "var(--accent-primary)" : "var(--fg-muted)",
            }}
          >
            {tab === "overview" ? "Journey Overview" : tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
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
        )}

        {activeTab === "journal" && (
          <motion.div
            key="journal"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Create Journal Form */}
            <div className="lg:col-span-1 p-6 rounded-2xl space-y-4 h-fit" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
              <h3 className="font-bold text-md flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
                <BookOpen size={16} className="text-purple-400" />
                <span>Write Journal Entry</span>
              </h3>
              <form onSubmit={handleCreateJournal} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Entry Title</label>
                  <input
                    type="text"
                    value={newJournalTitle}
                    onChange={(e) => setNewJournalTitle(e.target.value)}
                    placeholder="How was today?"
                    className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Content</label>
                  <textarea
                    rows={6}
                    value={newJournalContent}
                    onChange={(e) => setNewJournalContent(e.target.value)}
                    placeholder="Share your raw feelings or recovery notes here…"
                    className="w-full px-3 py-2.5 rounded-xl text-xs outline-none resize-none"
                    style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Associated Mood</label>
                  <div className="flex gap-1">
                    {MOOD_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setNewJournalMood(opt.value)}
                        className="p-2.5 rounded-xl transition-all hover:scale-105"
                        style={{
                          background: newJournalMood === opt.value ? opt.bg : "var(--bg-base)",
                          border: `1px solid ${newJournalMood === opt.value ? opt.color : "var(--border-default)"}`,
                        }}
                      >
                        <opt.icon size={18} style={{ color: newJournalMood === opt.value ? opt.color : "var(--fg-muted)" }} />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
                  style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}
                >
                  <Plus size={14} /> Save Entry
                </button>
              </form>
            </div>

            {/* Journals List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-muted)" }} />
                <input
                  type="text"
                  placeholder="Search journals…"
                  value={journalSearch}
                  onChange={(e) => setJournalSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none"
                  style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
                />
              </div>

              {filteredJournals.length === 0 ? (
                <div className="py-20 rounded-2xl text-center space-y-3" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
                  <BookOpen size={24} style={{ color: "var(--fg-muted)" }} className="mx-auto" />
                  <p className="text-xs" style={{ color: "var(--fg-muted)" }}>No journal entries found. Share your thoughts!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredJournals.map((item) => {
                    const opt = MOOD_OPTIONS.find((o) => o.value === item.mood) || MOOD_OPTIONS[0];
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedJournal(item)}
                        className="p-5 rounded-2xl cursor-pointer hover:border-purple-400 transition-all flex flex-col justify-between space-y-4 relative group"
                        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px]" style={{ color: "var(--fg-muted)" }}>
                              {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            </span>
                            <span className="p-1 rounded-lg" style={{ background: opt.bg }}>
                              <opt.icon size={13} style={{ color: opt.color }} />
                            </span>
                          </div>
                          <h4 className="font-bold text-sm truncate" style={{ color: "var(--fg-primary)" }}>{item.title}</h4>
                          <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: "var(--fg-muted)" }}>{item.content}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                          <span className="text-[10px] font-medium text-purple-400 group-hover:underline">Read Entry →</span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteJournal(item.id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Read Entry Modal */}
            {selectedJournal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-lg rounded-2xl p-6 space-y-4 relative overflow-hidden"
                  style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
                >
                  <button
                    onClick={() => setSelectedJournal(null)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-700/20 text-slate-400 hover:text-slate-100"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono" style={{ color: "var(--fg-muted)" }}>
                      {new Date(selectedJournal.createdAt).toLocaleString()}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full capitalize" style={{
                      color: MOOD_OPTIONS.find((o) => o.value === selectedJournal.mood)?.color,
                      background: MOOD_OPTIONS.find((o) => o.value === selectedJournal.mood)?.bg
                    }}>
                      {selectedJournal.mood}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--fg-primary)" }}>{selectedJournal.title}</h3>
                  <div className="p-4 rounded-xl text-xs leading-relaxed max-h-[300px] overflow-y-auto" style={{ background: "var(--bg-base)", color: "var(--fg-secondary)" }}>
                    <p className="whitespace-pre-wrap">{selectedJournal.content}</p>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSelectedJournal(null)}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold"
                      style={{ background: "var(--accent-glow)", color: "var(--accent-primary)" }}
                    >
                      Close Entry
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "goals" && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Create Goal Form */}
            <div className="lg:col-span-1 p-6 rounded-2xl space-y-4 h-fit" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
              <h3 className="font-bold text-md flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
                <Target size={16} className="text-amber-400" />
                <span>Create Growth Goal</span>
              </h3>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Goal Description</label>
                  <input
                    type="text"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="E.g. Sleep before 11 PM"
                    className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Category Tag</label>
                  <select
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
                  >
                    <option value="Wellness">Wellness</option>
                    <option value="Meditation">Meditation</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Social">Social</option>
                    <option value="Sober Days">Sober Days</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
                  style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}
                >
                  <Plus size={14} /> Add Goal
                </button>
              </form>
            </div>

            {/* Goals List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center p-4 rounded-xl text-xs font-semibold" style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
                <span style={{ color: "var(--accent-primary)" }}>Progress Rate</span>
                <span style={{ color: "var(--accent-primary)" }}>
                  {goals.length > 0 ? `${Math.round((completedGoalsCount / goals.length) * 100)}%` : "0%"} ({completedGoalsCount} of {goals.length} goals completed)
                </span>
              </div>

              {goals.length === 0 ? (
                <div className="py-20 rounded-2xl text-center space-y-3" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
                  <Target size={24} style={{ color: "var(--fg-muted)" }} className="mx-auto" />
                  <p className="text-xs" style={{ color: "var(--fg-muted)" }}>No goals added yet. Start setting goals for your recovery path!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-4 rounded-xl flex items-center justify-between transition-all"
                      style={{
                        background: "var(--bg-subtle)",
                        border: `1px solid ${goal.completed ? "var(--border-accent)" : "var(--border-default)"}`,
                        opacity: goal.completed ? 0.75 : 1,
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleGoal(goal.id)}
                          className="shrink-0 transition-transform hover:scale-110"
                          style={{ color: goal.completed ? "var(--accent-primary)" : "var(--fg-muted)" }}
                        >
                          {goal.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className="text-xs font-semibold truncate"
                            style={{
                              color: "var(--fg-primary)",
                              textDecoration: goal.completed ? "line-through" : "none",
                            }}
                          >
                            {goal.text}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "var(--bg-base)", color: "var(--fg-muted)" }}>
                              {goal.category}
                            </span>
                            {goal.targetDate && (
                              <span className="text-[9px]" style={{ color: "var(--fg-muted)" }}>
                                Target: {new Date(goal.targetDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
