import { ShieldCheck } from "lucide-react";
import { Input } from "../../../../components/common/Input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import type { GeneralInfoFormProps } from "../types/admin-profile.types.ts";

export const GeneralInfoForm = ({
  admin,
  name,
  setName,
  profileImageFile,
  isLoading,
  onFileSelect,
  onSubmit,
}: GeneralInfoFormProps) => {
  const avatarPreview = profileImageFile ? URL.createObjectURL(profileImageFile) : admin.profileImage;

  return (
    <div className="p-6 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
        <ShieldCheck size={18} /> General Information
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex flex-col gap-6">
          <div className="shrink-0 relative group self-start">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500/20 relative">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-500/10 text-primary-600 font-bold text-2xl">
                  {admin.name?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer text-white text-xs font-medium">
                <span>Change</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onFileSelect}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <Input
              label="Email Address"
              value={admin.email}
              disabled
              className="opacity-70"
            />
            <p className="text-xs text-brand-900/40 dark:text-white/40 mt-1">Admin email cannot be changed.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <Button type="submit" loading={isLoading} disabled={name === admin.name && !profileImageFile}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};