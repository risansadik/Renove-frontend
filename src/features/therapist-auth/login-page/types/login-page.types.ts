import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { LoginForm } from "../../../../core/utils/form-schemas.ts";

export interface LoginFormSectionProps {
  register: UseFormRegister<LoginForm>;
  errors: FieldErrors<LoginForm>;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
