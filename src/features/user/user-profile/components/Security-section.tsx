import { ShieldAlert } from "lucide-react";
import type { SecuritySectionProps } from "../types/user-profile.types";
import { PasswordChangeForm } from "../../../../components/common/PasswordChangeForm";

export const SecuritySection = ({
  isGoogleAuth,
  isLoading,
  handleChangePassword,
}: SecuritySectionProps) => {
  if (isGoogleAuth) {
    return (
      <div className="p-6 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
          Security
        </h2>
        <div className="p-4 rounded-xl flex flex-col items-center text-center gap-3"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--fg-primary)" }}>Google Authentication</p>
            <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
              You are logged in using Google. Password changes are disabled for your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PasswordChangeForm onSubmit={handleChangePassword} isLoading={isLoading} />
  );
};