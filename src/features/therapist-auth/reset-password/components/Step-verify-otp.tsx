import { Controller } from "react-hook-form";
import { OtpInput } from "../../../../components/common/Otp-input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import type { StepVerifyOtpProps } from "../types/reset-password.types.ts";

export const StepVerifyOtp = ({
  control,
  errors,
  loading,
  resending,
  countdown,
  canResend,
  onVerify,
  onResend,
}: StepVerifyOtpProps) => (
  <div className="flex flex-col gap-6">
    <div>
      <p className="label mb-3 text-brand-900/60">Verification code</p>
      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChange={field.onChange}
            error={errors.otp?.message}
          />
        )}
      />
    </div>
    
    <Button type="button" onClick={onVerify} loading={loading}>
      Verify Code
    </Button>

    <div className="text-center">
      {canResend ? (
        <button
          type="button"
          onClick={onResend}
          disabled={resending}
          className="text-brand-600 hover:text-brand-800 text-sm font-medium transition-colors"
        >
          {resending ? "Resending..." : "Resend code"}
        </button>
      ) : (
        <span className="text-brand-900/40 text-sm">
          Resend code in <span className="text-brand-900/60 font-mono">{countdown}s</span>
        </span>
      )}
    </div>
  </div>
);