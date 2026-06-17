import { Link } from "react-router-dom";
import { AuthLayout } from "../../../../components/layout/Auth-layout.tsx";
import { useTherapistLogin } from "../hooks/use-login-page";
import { LoginFormSection } from "../components/Login-form-section.tsx";
import { TherapistLoginPanel } from "../components/Therapist-login-panel.tsx";

export const TherapistLoginPage = () => {
  const { loading, register, errors, handleSubmit } = useTherapistLogin();

  return (
    <AuthLayout panel={<TherapistLoginPanel />}>
      <div className="auth-card p-8 stagger-2">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Therapist sign in</h1>
          <p className="text-brand-900/60 text-sm">Access your therapist dashboard.</p>
        </div>

        <LoginFormSection
          register={register}
          errors={errors}
          loading={loading}
          onSubmit={handleSubmit}
        />

        <p className="text-center text-brand-900/60 text-sm mt-6">
          Not registered yet?{" "}
          <Link to="/therapist/register" className="text-brand-600 hover:text-brand-800 font-medium transition-colors">
            Apply as a therapist
          </Link>
        </p>

        <p className="text-center text-brand-900/40 text-xs mt-3">
          Are you a user?{" "}
          <Link to="/user/login" className="text-brand-900/60 hover:text-brand-900 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};