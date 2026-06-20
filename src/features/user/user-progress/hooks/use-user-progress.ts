import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuthStore, selectAuthUser } from "../../../../store/use-auth-store";
import { userDashboardService, type DashboardData } from "../../../../services/api/auth.service";
import type { BookingResponse } from "../../../../services/api/booking.service";
import type { Goal, JournalEntry } from "../types/user-progress.types";
import bookingService from "../../../../services/api/booking.service";
import userProgressService from "../../../../services/api/user-progress.service";

export const useUserProgress = () => {
  const user = useAuthStore(selectAuthUser);

  const [data, setData] = useState<DashboardData | null>(null);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "overview" | "journal" | "goals"
  >("overview");

  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [journalsLoading, setJournalsLoading] = useState(false);
  const [newJournalTitle, setNewJournalTitle] = useState("");
  const [newJournalContent, setNewJournalContent] = useState("");
  const [newJournalMood, setNewJournalMood] = useState("great");
  const [journalSearch, setJournalSearch] = useState("");
  const [selectedJournal, setSelectedJournal] =
    useState<JournalEntry | null>(null);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
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

  const fetchJournals = useCallback(async () => {
    if (!user?.id) return;
    setJournalsLoading(true);
    try {
      const res = await userProgressService.getJournals();
      setJournals(res.data.data ?? []);
    } catch (error) {
      console.error("Failed to load journals", error);
    } finally {
      setJournalsLoading(false);
    }
  }, [user?.id]);

  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;
    setGoalsLoading(true);
    try {
      const res = await userProgressService.getGoals();
      setGoals(res.data.data ?? []);
    } catch (error) {
      console.error("Failed to load goals", error);
    } finally {
      setGoalsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (user?.id) {
      fetchJournals();
      fetchGoals();
    }
  }, [user?.id, fetchJournals, fetchGoals]);

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

  const handleCreateJournal = async (
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

    try {
      const res = await userProgressService.createJournal({
        title: newJournalTitle.trim(),
        content: newJournalContent.trim(),
        mood: newJournalMood,
      });

      const created = res.data.data;
      if (created) {
        setJournals((prev) => [created, ...prev]);
      }

      setNewJournalTitle("");
      setNewJournalContent("");

      toast.success("Journal entry saved!");
    } catch {
      toast.error("Failed to save journal entry.");
    }
  };

  const handleDeleteJournal = async (
    id: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    try {
      await userProgressService.deleteJournal(id);

      setJournals((prev) =>
        prev.filter((journal) => journal.id !== id)
      );

      if (selectedJournal?.id === id) {
        setSelectedJournal(null);
      }

      toast.success("Journal entry deleted");
    } catch {
      toast.error("Failed to delete journal entry.");
    }
  };

  const handleCreateGoal = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newGoalText.trim()) return;

    try {
      const res = await userProgressService.createGoal({
        text: newGoalText.trim(),
        category: newGoalCategory,
        targetDate: newGoalDate || undefined,
      });

      const created = res.data.data;
      if (created) {
        setGoals((prev) => [created, ...prev]);
      }

      setNewGoalText("");
      setNewGoalDate("");

      toast.success("Goal added!");
    } catch {
      toast.error("Failed to add goal.");
    }
  };

  const handleToggleGoal = async (id: string) => {
    try {
      const res = await userProgressService.toggleGoal(id);
      const updated = res.data.data;
      if (updated) {
        setGoals((prev) =>
          prev.map((goal) => (goal.id === id ? updated : goal))
        );
      }
      toast.success("Goal updated!");
    } catch {
      toast.error("Failed to update goal.");
    }
  };

  const handleDeleteGoal = async (
    id: string
  ) => {
    try {
      await userProgressService.deleteGoal(id);
      setGoals((prev) =>
        prev.filter((goal) => goal.id !== id)
      );
      toast.success("Goal removed");
    } catch {
      toast.error("Failed to remove goal.");
    }
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
    journalsLoading,
    goalsLoading,

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