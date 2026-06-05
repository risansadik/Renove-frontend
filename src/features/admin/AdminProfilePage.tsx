import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/use-auth-store.ts";
import { profileService } from "../../services/api/profile.service.ts";
import { Input } from "../../components/common/Input.tsx";
import { Button } from "../../components/common/Button.tsx";
import { ImageCropper } from "../../components/common/ImageCropper.tsx";
import { PasswordChangeForm } from "../../components/common/PasswordChangeForm.tsx";
import { User, ShieldCheck } from "lucide-react";
import type { Admin } from "../../domain/model/index.ts";

export const AdminProfilePage = () => {
  const { session, setAdmin } = useAuthStore();
  const authAdmin = session?.role === "admin" ? session.profile : null;

  const [admin, setLocalAdmin] = useState<Admin | null>(authAdmin as Admin);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await profileService.getAdminProfile();
        if (res.success && res.data?.admin) {
          setLocalAdmin(res.data.admin);
          setAdmin(res.data.admin);
        }
      } finally {
        setIsFetching(false);
      }
    };

    const timer = setTimeout(() => {
      loadProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, [setAdmin]);

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

  const [prevAdmin, setPrevAdmin] = useState<Admin | null>(null);

  if (admin !== prevAdmin) {
    setPrevAdmin(admin);
    if (admin) {
      setName(admin.name || "");
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

      const res = await profileService.updateAdminProfile(formData);
      if (res.success && res.data?.admin) {
        setLocalAdmin(res.data.admin);
        setAdmin(res.data.admin);
        toast.success("Profile updated successfully!");
        setProfileImageFile(null);
      }
    }finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (currentPasswordRaw: string, newPasswordRaw: string) => {
    setIsLoading(true);
    try {
      await profileService.changeAdminPassword({
        currentPasswordRaw,
        newPasswordRaw
      });
      toast.success("Password changed successfully!");
    }  finally {
      setIsLoading(false);
    }
  };

  if (isFetching || !admin) return <div className="p-8 text-center text-brand-900/50">Loading profile...</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
          <User className="text-primary-500" /> Admin Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>Manage your administrator credentials and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Col: General Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
              <ShieldCheck size={18} /> General Information
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col gap-6">
                <div className="shrink-0 relative group self-start">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500/20 relative">
                    {profileImageFile ? (
                      <img src={URL.createObjectURL(profileImageFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : admin.profileImage ? (
                      <img src={admin.profileImage} alt="Profile" className="w-full h-full object-cover" />
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
                        onChange={handleFileSelect}
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
        </div>

        {/* Right Col: Security */}
        <div className="space-y-6">
          <PasswordChangeForm onSubmit={handleChangePassword} isLoading={isLoading} />
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
