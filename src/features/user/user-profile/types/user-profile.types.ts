export interface GeneralInfoFormProps {
  user: {
    name: string;
    email: string;
    profileImage?: string;
  };
  name: string;
  setName: (name: string) => void;
  profileImageFile: File | null;
  isLoading: boolean;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
}

export interface SecuritySectionProps {
  isGoogleAuth: boolean;
  isLoading: boolean;
  handleChangePassword: (currentPasswordRaw: string, newPasswordRaw: string) => Promise<void>;
}
