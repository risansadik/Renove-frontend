import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/use-auth-store.ts";
import { profileService } from "../../../../services/api/profile.service.ts";
import type { Admin } from "../../../../domain/model/index.ts";

export const useAdminProfile = () => {
  const { session, setAdmin } = useAuthStore();
  const authAdmin = session?.role === "admin" ? session.profile : null;

  const [admin, setLocalAdmin] = useState<Admin | null>(authAdmin as Admin);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form Fields State
  const [name, setName] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  // Core Data Lifecycle Sync
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

    loadProfile();
  }, [setAdmin]);

  // Synchronize local form inputs cleanly when domain model resolves or updates
  useEffect(() => {
    if (admin) {
      setName(admin.name || "");
    }
  }, [admin]);

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

      const res = await profileService.updateAdminProfile(formData);
      if (res.success && res.data?.admin) {
        setLocalAdmin(res.data.admin);
        setAdmin(res.data.admin);
        toast.success("Profile updated successfully!");
        setProfileImageFile(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (currentPasswordRaw: string, newPasswordRaw: string) => {
    setIsLoading(true);
    try {
      await profileService.changeAdminPassword({
        currentPasswordRaw,
        newPasswordRaw,
      });
      toast.success("Password changed successfully!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
    setProfileImageFile(file);
    setCropImageSrc(null);
  };

  const handleCropCancel = () => {
    setCropImageSrc(null);
  };

  return {
    admin,
    name,
    setName,
    isLoading,
    isFetching,
    profileImageFile,
    cropImageSrc,
    handleFileSelect,
    handleUpdateProfile,
    handleChangePassword,
    handleCropComplete,
    handleCropCancel,
  };
};