import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { AdminLoginForm as LoginFields } from "../../../../core/utils/form-schemas.ts";

export interface AdminLoginFormProps {
    loading: boolean;
    errors: FieldErrors<LoginFields>;
    register: UseFormRegister<LoginFields>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
