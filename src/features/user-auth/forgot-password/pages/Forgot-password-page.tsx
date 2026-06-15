import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import { AuthLayout } from "../../../../components/layout/Auth-layout.tsx";
import { useForgotPassword } from "../hooks/use-forgot-password.ts";
import { RequestResetForm } from "../components/Request-reset-form.tsx";
import { ResetSuccessView } from "../components/Reset-success-view.tsx";

export const ForgotPasswordPage = () => {
    const {
        register,
        handleSubmit,
        errors,
        loading,
        sent,
        emailValue,
        handleContinue,
    } = useForgotPassword();

    return (
        <AuthLayout>
            <div className="auth-card p-8 stagger-2">
                <Link
                    to="/user/login"
                    className="inline-flex items-center gap-2 text-brand-900/60 hover:text-brand-900/80 text-sm mb-8 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to login
                </Link>

                <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-6">
                    <KeyRound size={24} className="text-brand-600" />
                </div>

                {!sent ? (
                    <RequestResetForm
                        onSubmit={handleSubmit}
                        register={register}
                        errors={errors}
                        loading={loading}
                    />
                ) : (
                    <ResetSuccessView
                        emailValue={emailValue}
                        handleContinue={handleContinue}
                    />
                )}
            </div>
        </AuthLayout>
    );
};