import React, { useState } from "react";
import { PasswordInput } from "./Password-input.tsx";
import { Button } from "./Button.tsx";
import { KeyRound } from "lucide-react";
import toast from "react-hot-toast";

interface PasswordChangeFormProps {
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
}

export const PasswordChangeForm = ({ onSubmit, isLoading }: PasswordChangeFormProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All password fields are required");
    }
    if (newPassword.length < 8) {
      return toast.error("New password must be at least 8 characters long");
    }

    // Strict password strength validation matching backend ChangePasswordSchema
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return toast.error(
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      await onSubmit(currentPassword, newPassword);
      // Reset form on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // Errors should be handled by the parent caller or toast
    }
  };

  const isFormInvalid = !currentPassword || !newPassword || !confirmPassword;

  return (
    <div className="p-6 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
        <KeyRound size={18} className="text-primary-500" /> Security & Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          required
        />
        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Min. 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char"
          required
        />
        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-type new password"
          required
        />
        <Button
          type="submit"
          variant="outline"
          className="w-full mt-2"
          loading={isLoading}
          disabled={isFormInvalid || isLoading}
        >
          Update Password
        </Button>
      </form>
    </div>
  );
};
