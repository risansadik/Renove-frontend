import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layout/Auth-layout.tsx";
import { Input } from "../../components/common/Input.tsx";
import { PasswordInput } from "../../components/common/Password-input.tsx";
import { Button } from "../../components/common/Button.tsx";
import { loginSchema, type LoginForm } from "../../core/utils/form-schemas.ts";
import { userAuthService } from "../../services/api/auth.service.ts";
import { handleError } from "../../core/utils/error-handler.ts";
import { useAuthStore } from "../../store/use-auth-store.ts";

export const UserLoginPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const blockedReason = sessionStorage.getItem("blocked_reason");
    if (blockedReason) {
      toast.error(blockedReason, { id: "blocked-toast", duration: 6000 });
      sessionStorage.removeItem("blocked_reason");
    }
  }, []);

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
      handleError(err, "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        const accessToken = tokenResponse.access_token;
        if (!accessToken) throw new Error("No access token received");

        const res = await userAuthService.googleAuth(accessToken);
        const user = res.data.data?.user;
        if (user) {
          setUser(user);
          toast.success(`Welcome back, ${user.name}!`);
          navigate("/dashboard");
        }
      } catch (err) {
        handleError(err, "Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error("Google login failed")
  });

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

        <div className="flex justify-center mt-4 w-full">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            disabled={googleLoading || loading}
            className="btn-outline flex items-center justify-center gap-2.5 w-full"
            style={{
              background: "var(--bg-card)",
              border: "1.5px solid var(--border-strong)",
              color: "var(--fg-primary)",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              fontWeight: 500,
              fontSize: "0.875rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--nav-bg-hover)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-card)";
            }}
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="text-center text-brand-900/60 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/user/register" className="text-brand-600 hover:text-brand-800 font-medium transition-colors">
            Sign up free
          </Link>
        </p>

        <p className="text-center text-brand-900/40 text-xs mt-3">
          Are you a therapist?{" "}
          <Link to="/therapist/login" className="text-brand-900/60 hover:text-brand-900 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};