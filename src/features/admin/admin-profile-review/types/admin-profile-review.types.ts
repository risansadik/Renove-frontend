import type { Therapist } from "../../../../domain/model";

export interface TherapistReviewCardProps {
  therapist: Therapist;
  isProcessing: boolean;
  onApprove: (id: string) => Promise<void>;
  onRejectClick: (therapist: Therapist) => void;
}

export interface RejectionReasonModalProps {
  isOpen: boolean;
  therapist: Therapist | null;
  reason: string;
  setReason: (val: string) => void;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}
