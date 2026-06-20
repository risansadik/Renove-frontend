import { Award, BookOpen, Clock, Flame, Frown, Meh, Smile, Sparkles, Target } from "lucide-react";
import type { DashboardData } from "../../../../services/api/auth.service";
import type { BookingResponse } from "../../../../services/api/booking.service";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  targetDate?: string;
  createdAt: string;
}

export interface JourneyOverviewTabProps {
  data: DashboardData | null;
  bookings: BookingResponse[];
  goals: Goal[];
  journals: JournalEntry[];
  totalSessionsDone: number;
  completedGoalsCount: number;
  moodSelected: string | null;
  moodLogging: boolean;
  stats: {
    moodLogsCount: number;
    journalsCount: number;
    completedGoalsCount: number;
    sessionsCount: number;
    streakDays: number;
  };
  handleMoodLog: (mood: string) => Promise<void>;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: typeof Award;
  color: string;
  check: (stats: {
    moodLogsCount: number;
    journalsCount: number;
    completedGoalsCount: number;
    sessionsCount: number;
    streakDays: number;
  }) => boolean;
}

export const MILESTONES: Milestone[] = [
  {
    id: "first_mood",
    title: "First Step Taken",
    description: "Log your first emotional state",
    icon: Smile,
    color: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    check: (s) => s.moodLogsCount > 0,
  },
  {
    id: "reflective",
    title: "Reflective Mind",
    description: "Write your first journal entry",
    icon: BookOpen,
    color: "linear-gradient(135deg, #10b981, #3b82f6)",
    check: (s) => s.journalsCount > 0,
  },
  {
    id: "streak_3",
    title: "Consistent Spirit",
    description: "Reach a 3-day recovery streak",
    icon: Flame,
    color: "linear-gradient(135deg, #f59e0b, #ef4444)",
    check: (s) => s.streakDays >= 3,
  },
  {
    id: "goal_getter",
    title: "Goal Achiever",
    description: "Complete at least one recovery goal",
    icon: Target,
    color: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    check: (s) => s.completedGoalsCount > 0,
  },
  {
    id: "session_1",
    title: "Healing Journey",
    description: "Attend your first therapy session",
    icon: Clock,
    color: "linear-gradient(135deg, #6366f1, #a855f7)",
    check: (s) => s.sessionsCount > 0,
  },
  {
    id: "deep_journal",
    title: "Insight Seeker",
    description: "Log 3 journal entries",
    icon: Sparkles,
    color: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    check: (s) => s.journalsCount >= 3,
  },
];

export const MOOD_OPTIONS = [
  { value: "great", icon: Smile, label: "Great", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  { value: "good", icon: Smile, label: "Good", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  { value: "okay", icon: Meh, label: "Okay", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  { value: "low", icon: Frown, label: "Low", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
  { value: "crisis", icon: Frown, label: "Crisis", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
] as const;

export interface JournalTabProps {
  handleCreateJournal: (e: React.FormEvent) => Promise<void>;
  newJournalTitle: string;
  setNewJournalTitle: (val: string) => void;
  newJournalContent: string;
  setNewJournalContent: (val: string) => void;
  newJournalMood: string;
  setNewJournalMood: (val: string) => void;
  journalSearch: string;
  setJournalSearch: (val: string) => void;
  filteredJournals: JournalEntry[];
  setSelectedJournal: (entry: JournalEntry) => void;
  handleDeleteJournal: (id: string, e: React.MouseEvent) => Promise<void>;
}

export interface JournalModalProps {
  selectedJournal: JournalEntry | null;
  setSelectedJournal: (entry: JournalEntry | null) => void;
}

export interface GoalsTabProps {
  handleCreateGoal: (e: React.FormEvent) => Promise<void>;
  newGoalText: string;
  setNewGoalText: (val: string) => void;
  newGoalCategory: string;
  setNewGoalCategory: (val: string) => void;
  newGoalDate: string;
  setNewGoalDate: (val: string) => void;
  goals: Goal[];
  completedGoalsCount: number;
  handleToggleGoal: (id: string) => Promise<void>;
  handleDeleteGoal: (id: string) => Promise<void>;
}