import { PasswordChangeForm } from "../../../../components/common/PasswordChangeForm.tsx";
import type { SecuritySectionProps } from "../types/admin-profile.types.ts";

export const SecuritySection = ({ isLoading, onChangePassword }: SecuritySectionProps) => {
  return (
    <div className="space-y-6">
      <PasswordChangeForm onSubmit={onChangePassword} isLoading={isLoading} />
    </div>
  );
};