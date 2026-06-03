import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/use-auth-store.ts";
import { profileService } from "../../services/api/profile.service.ts";
import { Input } from "../../components/common/Input.tsx";
import { Button } from "../../components/common/Button.tsx";
import { ImageCropper } from "../../components/common/ImageCropper.tsx";
import { PasswordChangeForm } from "../../components/common/PasswordChangeForm.tsx";
import { User, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";
import type { Therapist } from "../../domain/model/index.ts";
import { handleError } from "../../core/utils/error-handler.ts";

export const TherapistProfilePage = () => {
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
          setTherapist(res.data.therapist); // Update global store
        }
      } catch (err: unknown) {
        handleError(err, "Failed to load profile");
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

      // Personal Info
      formData.append("name", name);
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      // Professional Info
      const specArray = specialization.split(",").map(s => s.trim()).filter(Boolean);

      // Only append if it actually changed to avoid triggering unnecessary review
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
    } catch (err: unknown) {
      handleError(err, "Failed to update profile");
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
    } catch (err: unknown) {
      handleError(err, "Failed to change password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching || !therapist) return <div className="p-8 text-center" style={{ color: "var(--fg-muted)" }}>Loading profile...</div>;

  const isReviewRequired = therapist.status === "review_required";
  const isRejected = therapist.status === "rejected";
  const hasPending = !!therapist.pendingUpdates;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
            <User className="text-primary-500" /> Professional Profile
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>Manage your personal and professional marketplace information.</p>
        </div>

        <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${isReviewRequired
          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
          : isRejected
            ? "bg-red-500/10 text-red-500 border-red-500/20"
            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          }`}>
          {isReviewRequired ? <AlertTriangle size={16} /> : isRejected ? <AlertCircle size={16} /> : <ShieldCheck size={16} />}
          {isReviewRequired ? "Update Pending Admin Review" : isRejected ? "Profile Rejected" : "Approved & Public"}
        </div>
      </div>

      {isReviewRequired && (
        <div className="p-4 rounded-xl flex gap-3" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
          <AlertTriangle className="text-amber-500 shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-amber-600">Professional Updates Under Review</h3>
            <p className="text-sm text-amber-600/80 mt-1">
              Your recent changes to your professional information (bio, fee, qualifications) are being reviewed by our administration team.
              Your previously approved profile remains active and public until the new changes are approved.
            </p>
          </div>
        </div>
      )}

      {isRejected && therapist.adminRejectionReason && (
        <div className="p-4 rounded-xl flex gap-3" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-red-600">Profile Update Rejected</h3>
            <p className="text-sm text-red-600/80 mt-1">
              Reason: {therapist.adminRejectionReason}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Col: Main Form */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
            <h2 className="text-lg font-semibold mb-6" style={{ color: "var(--fg-primary)" }}>Update Information</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
                <div className="shrink-0 relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500/20 relative">
                    {profileImageFile ? (
                      <img src={URL.createObjectURL(profileImageFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : therapist.profileImage ? (
                      <img src={therapist.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-500/10 text-primary-600 font-bold text-2xl">
                        {therapist.name.charAt(0).toUpperCase()}
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
                    placeholder="Dr. Jane Doe"
                  />
                  <p className="text-xs text-brand-900/40 dark:text-white/40 mt-1">Changing your name applies immediately.</p>
                  <Input
                    label="Email Address"
                    value={therapist.email}
                    disabled
                    className="opacity-70"
                  />
                </div>
              </div>

              <div className="pt-6" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--fg-primary)" }}>Professional Details (Requires Approval)</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Qualification"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. Ph.D. in Clinical Psychology"
                    disabled={isReviewRequired}
                  />
                  <Input
                    label="Consultation Fee ($)"
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    placeholder="e.g. 150"
                    disabled={isReviewRequired}
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="Specializations (comma separated)"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Anxiety, Depression, Trauma"
                    disabled={isReviewRequired}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg-primary)" }}>
                    Professional Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                    disabled={isReviewRequired}
                    className="w-full px-3 py-2.5 rounded-xl text-sm transition-all outline-none disabled:opacity-70"
                    style={{
                      background: "var(--bg-input)",
                      border: "1px solid var(--border-default)",
                      color: "var(--fg-primary)",
                    }}
                    placeholder="Tell clients about your approach..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <Button type="submit" loading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Security & Pending View */}
        <div className="space-y-6">
          <PasswordChangeForm onSubmit={handleChangePassword} isLoading={isLoading} />

          {hasPending && (
            <div className="p-6 rounded-2xl" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
              <h3 className="text-sm font-bold flex items-center gap-2 mb-3" style={{ color: "var(--fg-primary)" }}>
                <AlertTriangle size={16} className="text-amber-500" /> Pending Changes Summary
              </h3>
              <div className="space-y-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                {Object.entries(therapist.pendingUpdates || {}).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="capitalize font-medium" style={{ color: "var(--fg-primary)" }}>{key}:</span>
                    <span className="truncate">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
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
