import { AnimatePresence } from "framer-motion";
import { Flame, Clock } from "lucide-react";
import { useUserProgress } from "../hooks/use-user-progress";
import { JourneyOverviewTab } from "../components/Journey-overview-tab";
import { JournalTab } from "../components/Journal-tab";
import { GoalsTab } from "../components/Goals-tab";
import { JournalModal } from "../components/Journal-modal";

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
            className="px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-0.5"
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
          <JourneyOverviewTab
            data={data}
            bookings={bookings}
            goals={goals}
            journals={journals}
            totalSessionsDone={totalSessionsDone}
            completedGoalsCount={completedGoalsCount}
            moodSelected={moodSelected}
            moodLogging={moodLogging}
            stats={stats}
            handleMoodLog={handleMoodLog}
          />
        )}

        {activeTab === "journal" && (
          <JournalTab
            handleCreateJournal={handleCreateJournal}
            newJournalTitle={newJournalTitle}
            setNewJournalTitle={setNewJournalTitle}
            newJournalContent={newJournalContent}
            setNewJournalContent={setNewJournalContent}
            newJournalMood={newJournalMood}
            setNewJournalMood={setNewJournalMood}
            journalSearch={journalSearch}
            setJournalSearch={setJournalSearch}
            filteredJournals={filteredJournals}
            setSelectedJournal={setSelectedJournal}
            handleDeleteJournal={handleDeleteJournal}
          />
        )}

        {activeTab === "goals" && (
          <GoalsTab
            handleCreateGoal={handleCreateGoal}
            newGoalText={newGoalText}
            setNewGoalText={setNewGoalText}
            newGoalCategory={newGoalCategory}
            setNewGoalCategory={setNewGoalCategory}
            newGoalDate={newGoalDate}
            setNewGoalDate={setNewGoalDate}
            goals={goals}
            completedGoalsCount={completedGoalsCount}
            handleToggleGoal={handleToggleGoal}
            handleDeleteGoal={handleDeleteGoal}
          />
        )}
      </AnimatePresence>

      {/* Read Entry Modal */}
      <JournalModal
        selectedJournal={selectedJournal}
        setSelectedJournal={setSelectedJournal}
      />
    </div>
  );
};