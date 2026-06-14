import { User } from "lucide-react";
import { ImageCropper } from "../../../../components/common/ImageCropper.tsx";
import { useAdminProfile } from "../hooks/use-admin-profile";
import { GeneralInfoForm } from "../components/General-info-form";
import { SecuritySection } from "../components/Security-section";

export const AdminProfilePage = () => {
  const {
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
  } = useAdminProfile();

  if (isFetching || !admin) {
    return <div className="p-8 text-center text-brand-900/50">Loading profile...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
          <User className="text-primary-500" /> Admin Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
          Manage your administrator credentials and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Profile Core Attributes */}
        <GeneralInfoForm
          admin={admin}
          name={name}
          setName={setName}
          profileImageFile={profileImageFile}
          isLoading={isLoading}
          onFileSelect={handleFileSelect}
          onSubmit={handleUpdateProfile}
        />

        {/* Right Column: Credential Controls */}
        <SecuritySection 
          isLoading={isLoading} 
          onChangePassword={handleChangePassword} 
        />
      </div>

      {/* Auxiliary Overlay: Image Cropping System Context */}
      {cropImageSrc && (
        <ImageCropper
          image={cropImageSrc}
          aspectRatio={1}
          onCrop={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};