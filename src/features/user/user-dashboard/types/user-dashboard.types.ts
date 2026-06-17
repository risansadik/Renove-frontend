import { Brain, Flame, Frown, Meh, Shield, Smile, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { type ApprovedTherapist, type TherapistRatingResult } from "../../../../services/api/auth.service.ts";
import type { DashboardData } from "../../../../services/api/auth.service.ts";

export interface UseTherapistDetailsProps {
  therapist: ApprovedTherapist | null;
  isOpen: boolean;
  onRatingSaved?: (therapistId: string, summary: Pick<TherapistRatingResult, "averageRating" | "totalRatings">) => void;
}

export interface TherapistDatailsProps {
  therapist: ApprovedTherapist | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (id: string) => void;
  onRatingSaved?: (therapistId: string, summary: Pick<TherapistRatingResult, "averageRating" | "totalRatings">) => void;
}

export const HOW_IT_WORKS = [
  { icon: Brain, label: "AI Analyzes You", desc: "Habits, triggers & patterns" },
  { icon: Zap, label: "World Generated", desc: "A path built for your life" },
  { icon: Star, label: "Daily Quests", desc: "Adapt as you grow" },
  { icon: Trophy, label: "Level Up", desc: "Real progress, real rewards" },
  { icon: Shield, label: "Expert Guides", desc: "AI + human accountability" },
];

export interface OrbPosition {
  top?: string;
  left?: string;
  right?: string;
  size: number;
  delay: number;
}

export const ORB_POSITIONS: OrbPosition[] = [
  { top: "10%", left: "5%", size: 300, delay: 0 },
  { top: "60%", right: "5%", size: 250, delay: 2 },
  { top: "30%", left: "40%", size: 180, delay: 1 },
];

export interface HeroSectionProps {
  data: DashboardData | null;
  isNew: boolean;
  greeting: string;
  onJourneyClick: () => void; 
}

export const MILESTONES = [
  { title: "First Step", desc: "Initiating your journey to freedom.", icon: Sparkles, done: true, active: true },
  { title: "Consistency Peak", desc: "Maintain a 7-day streak.", icon: Flame, done: false, active: true },
  { title: "Emotional Mastery", desc: "30 days of mindful logging.", icon: Brain, done: false, active: false },
  { title: "The Guardian", desc: "Reach Level 10 of recovery.", icon: Shield, done: false, active: false },
];

export interface JourneySectionProps {
  data: DashboardData | null;
  togglingId: string | null;
  onToggleMission: (id: string) => void;
}

export const AI_PROMPTS = ["I feel triggered", "Motivate me", "I need help", "Distract me"];

export interface SupportSectionProps {
  therapists: ApprovedTherapist[];
  onSelectTherapist: (t: ApprovedTherapist) => void;
}

export const MOOD_OPTIONS = [
  { value: "great", icon: Smile, label: "Great" },
  { value: "good", icon: Smile, label: "Good" },
  { value: "okay", icon: Meh, label: "Okay" },
  { value: "low", icon: Frown, label: "Low" },
  { value: "crisis", icon: Frown, label: "Crisis" },
] as const;

export interface ProgressSectionProps {
  data: DashboardData | null;
  moodSelected: string | null;
  moodLogging: boolean;
  onMood: (m: string) => void;
}


