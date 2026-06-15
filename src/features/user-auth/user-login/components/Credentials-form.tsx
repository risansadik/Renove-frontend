import { Link } from "react-router-dom";
import { Input } from "../../../../components/common/Input.tsx";
import { PasswordInput } from "../../../../components/common/Password-input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import type { CredentialsFormProps } from "../types/user-login.types.ts";

export const CredentialsForm = ({ onSubmit, register, errors, loading }: CredentialsFormProps) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-4">
    <Input
      label="Email address"
      type="email"
      placeholder="you@example.com"
      error={errors.email?.message}
      {...register("email")}
    />

    <div>
      <PasswordInput
        label="Password"
        placeholder="Your password"
        error={errors.password?.message}
        {...register("password")}
      />
      <div className="text-right mt-2">
        <Link
          to="/user/forgot-password"
          className="text-brand-600 hover:text-brand-800 text-xs transition-colors"
        >
          Forgot password?
        </Link>
      </div>
    </div>

    <Button type="submit" loading={loading} className="mt-2">
      Sign in
    </Button>
  </form>
);