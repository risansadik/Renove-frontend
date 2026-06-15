import { Link } from "react-router-dom";
import { AuthLayout } from "../../../../components/layout/Auth-layout.tsx";
import { useUserLogin } from "../hooks/use-user-login.ts";
import { CredentialsForm } from "../components/Credentials-form.tsx";
import { GoogleSignInButton } from "../components/Google-sign-in-button.tsx";

export const UserLoginPage = () => {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    googleLoading,
    loginWithGoogle
  } = useUserLogin();

  return (
    <AuthLayout>
      <div className="auth-card p-8 stagger-2">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Welcome back</h1>
          <p className="text-brand-900/60 text-sm">Sign in to continue your journey.</p>
        </div>

        <CredentialsForm 
          onSubmit={handleSubmit}
          register={register}
          errors={errors}
          loading={loading}
        />

        <div className="divider mt-5">or continue with</div>

        <div className="flex justify-center mt-4 w-full">
          <GoogleSignInButton 
            onClick={() => loginWithGoogle()}
            disabled={googleLoading || loading}
            googleLoading={googleLoading}
          />
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