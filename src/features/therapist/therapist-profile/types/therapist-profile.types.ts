import type { Therapist } from "../../../../domain/model";

export interface ProfileStatusBannerProps {
  therapist: Therapist;
}

export interface ProfileImageSectionProps {
  therapist: Therapist;
  profileImageFile: File | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PendingChangesSummaryProps {
  therapist: Therapist;
}