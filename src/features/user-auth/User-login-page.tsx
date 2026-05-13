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
import { loginSchema, type LoginForm } from "../../core/utils/form-schemas.js";
import { userAuthService } from "../../services/api/auth.service.js";
import { useAuthStore } from "../../store/use-auth-store.js";

export const UserLoginPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const res = await userAuthService.login(data);
      const user = res.data.data?.user;
      if (user) {
        setUser(user);
        toast.success(`Welcome back, ${user.name}!`);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
      toast.error(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card p-8 stagger-2">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Welcome back</h1>
          <p className="text-brand-900/60 text-sm">Sign in to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

        <div className="divider mt-5">or continue with</div>

        <div className="flex justify-center mt-4">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => toast.error("Google login failed")}
            useOneTap
            theme="outline"
            shape="pill"
            width="100%"
          />
        </div>

        <p className="text-center text-brand-900/60 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/user/register" className="text-brand-600 hover:text-brand-800 font-medium transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};