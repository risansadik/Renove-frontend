import { Input } from "../../../../components/common/Input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import { ImageCropper } from "../../../../components/common/ImageCropper.tsx";
import { PasswordChangeForm } from "../../../../components/common/PasswordChangeForm.tsx";
import { useTherapistProfile } from "../hooks/use-therapist-profile";
import { ProfileStatusBanner } from "../components/Profile-status-banner.tsx";
import { ProfileImageSection } from "../components/Profile-image-section.tsx";
import { PendingChangesSummary } from "../components/Pending-changes-summary.tsx";

export const TherapistProfilePage = () => {
  const {
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
  } = useTherapistProfile();

  if (isFetching || !therapist) {
    return <div className="p-8 text-center" style={{ color: "var(--fg-muted)" }}>Loading profile...</div>;
  }

  const isReviewRequired = therapist.status === "review_required";
  const hasPending = !!therapist.pendingUpdates;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <ProfileStatusBanner therapist={therapist} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Col: Main Form */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
            <h2 className="text-lg font-semibold mb-6" style={{ color: "var(--fg-primary)" }}>Update Information</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
                <ProfileImageSection
                  therapist={therapist} 
                  profileImageFile={profileImageFile} 
                  handleFileSelect={handleFileSelect} 
                />

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
          {hasPending && <PendingChangesSummary therapist={therapist} />}
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