import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/use-auth-store.ts";
import { profileService } from "../../services/api/profile.service.ts";
import { Input } from "../../components/common/Input.tsx";
import { Button } from "../../components/common/Button.tsx";
import { ImageCropper } from "../../components/common/ImageCropper.tsx";
import { PasswordChangeForm } from "../../components/common/PasswordChangeForm.tsx";
import { User, ShieldAlert } from "lucide-react";

export const UserProfilePage = () => {
  const { session, setUser } = useAuthStore();
  const user = session?.role === "user" ? session.profile : null;

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const isGoogleAuth = user ? "isGoogleAuth" in user && user.isGoogleAuth : false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [prevUser, setPrevUser] = useState<typeof user>(null);

  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setName(user.name);
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const res = await profileService.updateUserProfile(formData);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        toast.success("Profile updated successfully!");
        setProfileImageFile(null); // Reset file so we don't re-upload
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (currentPasswordRaw: string, newPasswordRaw: string) => {
    setIsLoading(true);
    try {
      await profileService.changeUserPassword({
        currentPasswordRaw,
        newPasswordRaw
      });
      toast.success("Password changed successfully!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
          <User className="text-primary-500" /> My Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col: General Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--fg-primary)" }}>General Information</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="shrink-0 relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500/20 relative">
                    {profileImageFile ? (
                      <img src={URL.createObjectURL(profileImageFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-500/10 text-primary-600 font-bold text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer text-white text-xs font-medium">
                      <span>Change</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <Input
                    label="Email Address"
                    value={user.email}
                    disabled
                    className="opacity-70"
                  />
                  <p className="text-xs text-brand-900/40 dark:text-white/40 mt-1">Email cannot be changed once registered.</p>
                </div>
              </div>

              <div className="flex justify-end pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <Button type="submit" loading={isLoading} disabled={name === user.name && !profileImageFile}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Security */}
        <div className="space-y-6">
          {isGoogleAuth ? (
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
          ) : (
            <PasswordChangeForm onSubmit={handleChangePassword} isLoading={isLoading} />
          )}
        </div>
      </div>

      {cropImageSrc && (
        <ImageCropper
          image={cropImageSrc}
          aspectRatio={1}
          onCrop={(blob) => {
            const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
            setProfileImageFile(file);
            setCropImageSrc(null);
          }}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
    </div>
  );
};
