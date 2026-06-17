import { Link } from "react-router-dom";
import { Input } from "../../../../components/common/Input.tsx";
import { PasswordInput } from "../../../../components/common/Password-input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import type { LoginFormSectionProps } from "../types/login-page.types.ts";

export const LoginFormSection = ({
  register,
  errors,
  loading,
  onSubmit,
}: LoginFormSectionProps) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-4">
    <Input
      label="Email address"
      type="email"
      placeholder="doctor@clinic.com"
      error={errors.email?.message}
      {...register("email")}
    />
    <PasswordInput
      label="Password"
      placeholder="Your password"
      error={errors.password?.message}
      {...register("password")}
    />

    <div className="flex justify-end">
      <Link
        to="/therapist/forgot-password"
        className="text-brand-600 hover:text-brand-800 text-sm font-medium transition-colors"
      >
        Forgot password?
      </Link>
    </div>

    <Button type="submit" loading={loading} className="mt-2">
      Sign in to dashboard
    </Button>
  </form>
);