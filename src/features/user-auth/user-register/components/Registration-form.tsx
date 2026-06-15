import { Input } from "../../../../components/common/Input.tsx";
import { PasswordInput } from "../../../../components/common/Password-input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import type { RegistrationFormProps } from "../types/user-register.types.ts";

export const RegistrationForm = ({ onSubmit, register, errors, loading }: RegistrationFormProps) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-4">
    <Input
      label="Full name"
      placeholder="Alex Johnson"
      error={errors.name?.message}
      {...register("name")}
    />
    <Input
      label="Email address"
      type="email"
      placeholder="you@example.com"
      error={errors.email?.message}
      {...register("email")}
    />
    <PasswordInput
      label="Password"
      placeholder="Min 8 chars, uppercase & number"
      error={errors.password?.message}
      {...register("password")}
    />
    <PasswordInput
      label="Confirm password"
      placeholder="Repeat your password"
      error={errors.confirmPassword?.message}
      {...register("confirmPassword")}
    />

    <Button type="submit" loading={loading} className="mt-2">
      Create account
    </Button>
  </form>
);