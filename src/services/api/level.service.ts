import apiClient from "./client.ts";
import { API_ROUTES } from "../../core/constants/api-routes.ts";
import type { ApiResponse } from "../../domain/model/index.ts";

export interface Level {
    id: string;
    userId: string;
    level: number;
    world: string;
    objective: string;
    target: number;
    unit: string;
    xp: number;
    reward: string;
    difficulty: "Easy" | "Medium" | "Hard";
    unlockRequirement: string;
    isCompleted: boolean;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface GenerateLevelsPayload {
    addictionType: string;
    severity: "mild" | "moderate" | "severe";
    interests: string[];
    startLevel?: number;
    endLevel?: number;
    regenerate?: boolean;
}

export const levelService = {
    generate: (data: GenerateLevelsPayload) =>
        apiClient.post<ApiResponse<Level[]>>(API_ROUTES.USER.LEVELS_GENERATE, data),

    getLevels: () =>
        apiClient.get<ApiResponse<Level[]>>(API_ROUTES.USER.LEVELS),

    completeLevel: (levelId: string) =>
        apiClient.patch<ApiResponse<Level>>(API_ROUTES.USER.LEVEL_COMPLETE(levelId)),
};