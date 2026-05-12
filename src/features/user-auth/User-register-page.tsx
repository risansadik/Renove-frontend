import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layout/Auth-layout.js";
import { Input } from "../../components/common/Input.js";
import { PasswordInput } from "../../components/common/Password-input.js";
import { Button } from "../../components/common/Button.js";
import { registerUserSchema, type RegisterUserForm } from "../../core/utils/form-schemas.js";
import { userAuthService } from "../../services/api/auth.service.js";

export const UserRegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserForm>({ resolver: zodResolver(registerUserSchema) });

  const onSubmit = async (data: RegisterUserForm) => {
    try {
      setLoading(true);
      const res = await userAuthService.register(data);
      toast.success("OTP sent to your email!");
      navigate("/user/verify-otp", { state: { email: res.data.data?.email } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast("Google auth coming soon");
  };

  return (
    <AuthLayout>
      <div className="auth-card p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-white/40 text-sm">Start your recovery journey today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

        <div className="divider mt-5">or continue with</div>

        <Button type="button" variant="outline" onClick={handleGoogleAuth}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/user/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-center text-white/20 text-xs mt-4">
          Are you a therapist?{" "}
          <Link to="/therapist/register" className="text-white/40 hover:text-white/60 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};