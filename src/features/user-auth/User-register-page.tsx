import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layout/Auth-layout.js";
import { Input } from "../../components/common/Input.js";
import { PasswordInput } from "../../components/common/Password-input.js";
import { Button } from "../../components/common/Button.js";
import { registerUserSchema, type RegisterUserForm } from "../../core/utils/form-schemas.js";
import { userAuthService } from "../../services/api/auth.service.js";
import { useAuthStore } from "../../store/use-auth-store.js";
import { useThemeStore } from "../../store/use-theme-store.js";
import { handleError } from "../../core/utils/error-handler.js";

export const UserRegisterPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
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
      handleError(err, "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const setUser = useAuthStore((s) => s.setUser);

  const onGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const idToken = credentialResponse.credential;
      if (!idToken) throw new Error("No idToken received");

      const res = await userAuthService.googleAuth(idToken);
      const user = res.data.data?.user;
      if (user) {
        setUser(user);
        toast.success(`Welcome, ${user.name}!`);
        navigate("/dashboard");
      }
    } catch (err) {
      handleError(err, "Google registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card p-8 stagger-2">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Create account</h1>
          <p className="text-brand-900/60 text-sm">Start your recovery journey today.</p>
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

        <div className="flex justify-center mt-4">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => toast.error("Google login failed")}
            useOneTap
            theme={theme === "dark" ? "filled_black" : "outline"}
            shape="pill"
            width="100%"
          />
        </div>

        <p className="text-center text-brand-900/60 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/user/login" className="text-brand-600 hover:text-brand-800 font-medium transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-center text-brand-900/40 text-xs mt-4">
          Are you a therapist?{" "}
          <Link to="/therapist/register" className="text-brand-900/60 hover:text-brand-900 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};