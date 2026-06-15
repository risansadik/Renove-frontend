import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { type RegisterUserForm } from "../../../../core/utils/form-schemas.ts";

export interface RegistrationFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<RegisterUserForm>;
  errors: FieldErrors<RegisterUserForm>;
  loading: boolean;
}

export interface GoogleRegisterButtonProps {
  onClick: () => void;
  disabled: boolean;
  googleLoading: boolean;
}
