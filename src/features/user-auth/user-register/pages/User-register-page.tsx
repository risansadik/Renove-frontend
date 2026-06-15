import { Link } from "react-router-dom";
import { useUserRegister } from "../hooks/use-user-register";
import { AuthLayout } from "../../../../components/layout/Auth-layout";
import { RegistrationForm } from "../components/Registration-form";
import { GoogleRegisterButton } from "../components/Google-register-button";

export const UserRegisterPage = () => {
  const {
    register,
    handleSubmit,
    errors,
    loading,
    googleLoading,
    loginWithGoogle,
  } = useUserRegister();

  return (
    <AuthLayout>
      <div className="auth-card p-8 stagger-2">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Create account</h1>
          <p className="text-brand-900/60 text-sm">Start your recovery journey today.</p>
        </div>

        <RegistrationForm
          onSubmit={handleSubmit}
          register={register}
          errors={errors}
          loading={loading}
        />

        <div className="divider mt-5">or continue with</div>

        <div className="flex justify-center mt-4 w-full">
          <GoogleRegisterButton
            onClick={() => loginWithGoogle()}
            disabled={googleLoading || loading}
            googleLoading={googleLoading}
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