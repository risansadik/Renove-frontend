import type { Admin } from "../../../../domain/model";

export interface GeneralInfoFormProps {
  admin: Admin;
  name: string;
  setName: (name: string) => void;
  profileImageFile: File | null;
  isLoading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface SecuritySectionProps {
  isLoading: boolean;
  onChangePassword: (currentPasswordRaw: string, newPasswordRaw: string) => Promise<void>;
}
