import { CheckCircle2 } from "lucide-react";
import { PasswordInput } from "../../../../components/common/Password-input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import type { StepNewPasswordProps } from "../types/reset-password.types.ts";


export const StepNewPassword = ({ register, errors, loading }: StepNewPasswordProps) => (
  <div className="flex flex-col gap-5">
    <div className="p-3 bg-sage-50 border border-sage-200 rounded-xl flex items-center gap-3 mb-2">
      <CheckCircle2 size={18} className="text-sage-600" />
      <span className="text-xs text-sage-800 font-medium">Email verified successfully</span>
    </div>

    <PasswordInput
      label="New password"
      placeholder="Min 8 chars, uppercase & number"
      error={errors.newPassword?.message}
      {...register("newPassword")}
    />
    
    <PasswordInput
      label="Confirm new password"
      placeholder="Repeat your new password"
      error={errors.confirmPassword?.message}
      {...register("confirmPassword")}
    />

    <Button type="submit" loading={loading} className="mt-2">
      Reset password
    </Button>
  </div>
);