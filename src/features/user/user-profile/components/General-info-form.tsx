import { Button } from "../../../../components/common/Button";
import { Input } from "../../../../components/common/Input";
import type { GeneralInfoFormProps } from "../types/user-profile.types";


export const GeneralInfoForm = ({
  user,
  name,
  setName,
  profileImageFile,
  isLoading,
  handleFileSelect,
  handleUpdateProfile,
}: GeneralInfoFormProps) => {
  return (
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
  );
};