import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/use-auth-store.ts";
import { profileService } from "../../../../services/api/profile.service.ts";
import type { Therapist } from "../../../../domain/model/index.ts";

export const useTherapistProfile = () => {
  const { session, setTherapist } = useAuthStore();
  const authTherapist = session?.role === "therapist" ? session.profile : null;

  const [therapist, setLocalTherapist] = useState<Therapist | null>(authTherapist);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await profileService.getTherapistProfile();
        if (res.success && res.data?.therapist) {
          setLocalTherapist(res.data.therapist);
          setTherapist(res.data.therapist);
        }
      } finally {
        setIsFetching(false);
      }
    };

    const timer = setTimeout(() => {
      loadProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, [setTherapist]);

  const [prevTherapist, setPrevTherapist] = useState<Therapist | null>(null);

  if (therapist !== prevTherapist) {
    setPrevTherapist(therapist);
    if (therapist) {
      setName(therapist.name || "");
      setBio(therapist.bio || "");
      setConsultationFee(therapist.consultationFee?.toString() || "");
      setSpecialization(therapist.specialization?.join(", ") || "");
      setQualification(therapist.qualification || "");
    }
  }

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
    if (!name.trim()) return toast.error("Name cannot be empty");

    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", name);
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const specArray = specialization.split(",").map(s => s.trim()).filter(Boolean);

      if (bio !== therapist?.bio) formData.append("bio", bio);
      if (Number(consultationFee) !== therapist?.consultationFee) formData.append("consultationFee", consultationFee);
      if (qualification !== therapist?.qualification) formData.append("qualification", qualification);
      if (specArray.join(",") !== therapist?.specialization?.join(",")) {
        formData.append("specialization", JSON.stringify(specArray));
      }

      const res = await profileService.updateTherapistProfile(formData);
      if (res.success && res.data?.therapist) {
        setLocalTherapist(res.data.therapist);
        setTherapist(res.data.therapist);

        if (res.data.therapist.status === "review_required") {
          toast.success("Professional updates submitted for admin review!");
        } else {
          toast.success("Profile updated successfully!");
        }

        setProfileImageFile(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (currentPasswordRaw: string, newPasswordRaw: string) => {
    setIsLoading(true);
    try {
      await profileService.changeTherapistPassword({
        currentPasswordRaw,
        newPasswordRaw
      });
      toast.success("Password changed successfully!");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    therapist,
    isLoading,
    isFetching,
    name,
    setName,
    profileImageFile,
    setProfileImageFile,
    bio,
    setBio,
    consultationFee,
    setConsultationFee,
    specialization,
    setSpecialization,
    qualification,
    setQualification,
    cropImageSrc,
    setCropImageSrc,
    handleFileSelect,
    handleUpdateProfile,
    handleChangePassword
  };
};