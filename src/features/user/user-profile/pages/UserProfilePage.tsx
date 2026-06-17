import { User } from "lucide-react";
import { useUserProfile } from "../hooks/use-user-profile";
import { GeneralInfoForm } from "../components/General-info-form";
import { SecuritySection } from "../components/Security-section";
import { ImageCropper } from "../../../../components/common/ImageCropper";

export const UserProfilePage = () => {
  const {
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
  } = useUserProfile();

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
          <User className="text-primary-500" /> My Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: General Info Form Module */}
        <div className="lg:col-span-2 space-y-6">
          <GeneralInfoForm
            user={user}
            name={name}
            setName={setName}
            profileImageFile={profileImageFile}
            isLoading={isLoading}
            handleFileSelect={handleFileSelect}
            handleUpdateProfile={handleUpdateProfile}
          />
        </div>

        {/* Right Column: Security Controls Module */}
        <div className="space-y-6">
          <SecuritySection
            isGoogleAuth={isGoogleAuth}
            isLoading={isLoading}
            handleChangePassword={handleChangePassword}
          />
        </div>
      </div>

      {/* Auxiliary Image Cropper Context */}
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