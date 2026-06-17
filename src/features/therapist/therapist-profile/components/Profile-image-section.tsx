import type { ProfileImageSectionProps } from "../types/therapist-profile.types";

export const ProfileImageSection = ({ therapist, profileImageFile, handleFileSelect }: ProfileImageSectionProps) => (
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
);