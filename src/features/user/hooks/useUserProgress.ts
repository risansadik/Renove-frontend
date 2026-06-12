import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import {
  userDashboardService,
  type DashboardData,
} from "../../../services/api/auth.service.ts";

import bookingService, {
  type BookingResponse,
} from "../../../services/api/booking.service.ts";

import {
  type Goal,
  type JournalEntry,
} from "../../../domain/model/index.ts";

export const useUserProgress = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "overview" | "journal" | "goals"
  >("overview");

  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [newJournalTitle, setNewJournalTitle] = useState("");
  const [newJournalContent, setNewJournalContent] = useState("");
  const [newJournalMood, setNewJournalMood] = useState("great");
  const [journalSearch, setJournalSearch] = useState("");
  const [selectedJournal, setSelectedJournal] =
    useState<JournalEntry | null>(null);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalCategory, setNewGoalCategory] =
    useState("Wellness");
  const [newGoalDate, setNewGoalDate] = useState("");

  const [moodSelected, setMoodSelected] =
    useState<string | null>(null);

  const [moodLogging, setMoodLogging] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [dashRes, bookingsRes] = await Promise.all([
        userDashboardService.getDashboard(),
        bookingService.getUserBookings(1, 100),
      ]);

      setData(dashRes.data.data ?? null);

      setMoodSelected(
        dashRes.data.data?.recentMoods?.slice(-1)[0]?.mood ??
          null
      );

      setBookings(bookingsRes.data ?? []);
    } catch (error) {
      console.error(
        "Failed to load progress data",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const localJournals =
      localStorage.getItem("renove_journals");

    if (localJournals) {
      setJournals(JSON.parse(localJournals));
    }

    const localGoals =
      localStorage.getItem("renove_goals");

    if (localGoals) {
      setGoals(JSON.parse(localGoals));
    }
  }, [fetchData]);

  const saveJournals = (
    items: JournalEntry[]
  ) => {
    setJournals(items);

    localStorage.setItem(
      "renove_journals",
      JSON.stringify(items)
    );
  };

  const saveGoals = (items: Goal[]) => {
    setGoals(items);

    localStorage.setItem(
      "renove_goals",
      JSON.stringify(items)
    );
  };

  const handleMoodLog = async (
    mood: string
  ) => {
    if (moodLogging) return;

    setMoodSelected(mood);
    setMoodLogging(true);

    try {
      await userDashboardService.logMood(mood);

      toast.success("Mood updated!");

      await fetchData();
    } catch {
      setMoodSelected(null);
    } finally {
      setMoodLogging(false);
    }
  };

  const handleCreateJournal = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !newJournalTitle.trim() ||
      !newJournalContent.trim()
    ) {
      toast.error(
        "Please fill in both title and content."
      );
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newJournalTitle.trim(),
      content: newJournalContent.trim(),
      mood: newJournalMood,
      createdAt: new Date().toISOString(),
    };

    saveJournals([entry, ...journals]);

    setNewJournalTitle("");
    setNewJournalContent("");

    toast.success("Journal entry saved!");
  };

  const handleDeleteJournal = (
    id: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const filtered = journals.filter(
      (journal) => journal.id !== id
    );

    saveJournals(filtered);

    if (selectedJournal?.id === id) {
      setSelectedJournal(null);
    }

    toast.success("Journal entry deleted");
  };

  const handleCreateGoal = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newGoalText.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      completed: false,
      category: newGoalCategory,
      targetDate: newGoalDate || undefined,
      createdAt: new Date().toISOString(),
    };

    saveGoals([goal, ...goals]);

    setNewGoalText("");
    setNewGoalDate("");

    toast.success("Goal added!");
  };

  const handleToggleGoal = (id: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            completed: !goal.completed,
          }
        : goal
    );

    saveGoals(updatedGoals);

    toast.success("Goal updated!");
  };

  const handleDeleteGoal = (
    id: string
  ) => {
    const filteredGoals = goals.filter(
      (goal) => goal.id !== id
    );

    saveGoals(filteredGoals);

    toast.success("Goal removed");
  };

  const totalSessionsDone =
    data?.totalSessionsDone ??
    bookings.filter(
      (booking) =>
        booking.status === "completed"
    ).length;

  const completedGoalsCount =
    goals.filter(
      (goal) => goal.completed
    ).length;

  const stats = {
    moodLogsCount:
      data?.recentMoods?.length ?? 0,
    journalsCount: journals.length,
    completedGoalsCount,
    sessionsCount: totalSessionsDone,
    streakDays: data?.streakDays ?? 0,
  };

  const filteredJournals =
    journals.filter(
      (journal) =>
        journal.title
          .toLowerCase()
          .includes(
            journalSearch.toLowerCase()
          ) ||
        journal.content
          .toLowerCase()
          .includes(
            journalSearch.toLowerCase()
          )
    );

  return {
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
  };
};