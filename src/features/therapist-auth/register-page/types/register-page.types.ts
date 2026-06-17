import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { RegisterTherapistFormInput } from "../../../../core/utils/form-schemas.ts";

export interface StepsIndicatorProps {
  currentStep: number;
  steps: string[];
}

export interface StepPersonalInfoProps {
  register: UseFormRegister<RegisterTherapistFormInput>;
  control: Control<RegisterTherapistFormInput>;
  errors: FieldErrors<RegisterTherapistFormInput>;
  profileFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cert") => void;
}

export interface StepProfessionalDetailsProps {
  register: UseFormRegister<RegisterTherapistFormInput>;
  errors: FieldErrors<RegisterTherapistFormInput>;
  certFiles: File[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cert") => void;
  onRemoveCert: (index: number) => void;
}

export interface StepAboutYouProps {
  register: UseFormRegister<RegisterTherapistFormInput>;
  errors: FieldErrors<RegisterTherapistFormInput>;
}

export const STEPS = ["Personal info", "Professional details", "About you"];
export const STEP_TITLES = ["Personal information", "Professional details", "About you"];
export const STEP_SUBTITLES = ["Step 1 of 3 - Basic info", "Step 2 of 3 - Credentials", "Step 3 of 3 - Final details"];
