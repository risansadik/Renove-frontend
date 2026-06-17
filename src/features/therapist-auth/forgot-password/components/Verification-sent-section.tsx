import { Button } from "../../../../components/common/Button.tsx";
import type { VerificationSentSectionProps } from "../types/forgot-password.types.ts";

export const VerificationSentSection = ({ email, onContinue }: VerificationSentSectionProps) => (
  <>
    <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Code sent!</h1>
    <p className="text-brand-900/60 text-sm mb-8">
      We've sent a 6-digit OTP to{" "}
      <span className="text-brand-600 font-mono">{email}</span>.
      Enter it on the next screen to reset your password.
    </p>
    <Button type="button" onClick={onContinue}>
      Continue to reset
    </Button>
  </>
);