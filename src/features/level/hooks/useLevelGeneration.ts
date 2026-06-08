import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  levelService,
  type Level,
  type GenerateLevelsPayload,
} from "../../../services/api/level.service.ts";

interface UseLevelGenerationReturn {
  levels: Level[];
  loading: boolean;
  generating: boolean;
  fetchLevels: () => Promise<void>;
  generateLevels: (payload: GenerateLevelsPayload) => Promise<void>;
  completeLevel: (levelId: string) => Promise<Level | null>;
}

export const useLevelGeneration = (): UseLevelGenerationReturn => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchLevels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await levelService.getLevels();
      setLevels(res.data.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateLevels = useCallback(async (payload: GenerateLevelsPayload) => {
    setGenerating(true);
    try {
      localStorage.setItem("renove_level_payload", JSON.stringify(payload));
      const res = await levelService.generate(payload);
      setLevels(res.data.data ?? []);
      toast.success("Your journey has been forged.");
    } catch {
      toast.error("Failed to generate your journey. Try again.");
    } finally {
      setGenerating(false);
    }
  }, []);

  const completeLevel = useCallback(async (levelId: string): Promise<Level | null> => {
    try {
      const res = await levelService.completeLevel(levelId);
      const completed = res.data.data ?? null;
      if (completed) {
        setLevels((prev) =>
          prev.map((l) => (l.id === levelId ? { ...l, isCompleted: true } : l))
        );
      }
      return completed;
    } catch {
      toast.error("Could not complete level. Try again.");
      return null;
    }
  }, []);

  return { levels, loading, generating, fetchLevels, generateLevels, completeLevel };
};