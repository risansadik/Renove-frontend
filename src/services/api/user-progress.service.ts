import apiClient from "./client.ts";
import { API_ROUTES } from "../../core/constants/api-routes.ts";
import type { ApiResponse } from "../../domain/model/index.ts";
import type { JournalEntry, Goal } from "../../features/user/user-progress/types/user-progress.types.ts";

export interface CreateJournalPayload {
  title: string;
  content: string;
  mood: string;
}

export interface CreateGoalPayload {
  text: string;
  category: string;
  targetDate?: string;
}

const userProgressService = {
  // ── Journals ──────────────────────────────────────────────

  getJournals: () =>
    apiClient.get<ApiResponse<JournalEntry[]>>(API_ROUTES.USER.PROGRESS_JOURNALS),

  createJournal: (payload: CreateJournalPayload) =>
    apiClient.post<ApiResponse<JournalEntry>>(API_ROUTES.USER.PROGRESS_JOURNALS, payload),

  deleteJournal: (id: string) =>
    apiClient.delete<ApiResponse<null>>(API_ROUTES.USER.PROGRESS_JOURNAL(id)),

  // ── Goals ─────────────────────────────────────────────────

  getGoals: () =>
    apiClient.get<ApiResponse<Goal[]>>(API_ROUTES.USER.PROGRESS_GOALS),

  createGoal: (payload: CreateGoalPayload) =>
    apiClient.post<ApiResponse<Goal>>(API_ROUTES.USER.PROGRESS_GOALS, payload),

  toggleGoal: (id: string) =>
    apiClient.patch<ApiResponse<Goal>>(API_ROUTES.USER.PROGRESS_GOAL_TOGGLE(id), {}),

  deleteGoal: (id: string) =>
    apiClient.delete<ApiResponse<null>>(API_ROUTES.USER.PROGRESS_GOAL(id)),
};

export default userProgressService;
