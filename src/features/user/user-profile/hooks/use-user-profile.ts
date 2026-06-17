import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/use-auth-store";
import { profileService } from "../../../../services/api/profile.service";

export const useUserProfile = () => {
  const { session, setUser } = useAuthStore();
  const user = session?.role === "user" ? session.profile : null;

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const isGoogleAuth = !!user?.isGoogleAuth;

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

  // Sync state derived from user updates cleanly
  const [prevUser, setPrevUser] = useState<typeof user>(null);
  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setName(user.name);
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()){
        toast.error("Name cannot be empty");
        return;
    }

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

  return {
    user,
    name,
    setName,
    isLoading,
    isGoogleAuth,
    profileImageFile,
    setProfileImageFile,
    cropImageSrc,
    setCropImageSrc,
    handleFileSelect,
    handleUpdateProfile,
    handleChangePassword,
  };
};