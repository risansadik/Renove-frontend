import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layout/Auth-layout.tsx";
import { Input } from "../../components/common/Input.tsx";
import { Button } from "../../components/common/Button.tsx";
import { forgotPasswordSchema, type ForgotPasswordForm } from "../../core/utils/form-schemas.ts";
import { userAuthService } from "../../services/api/auth.service.ts";
import { ArrowLeft, KeyRound } from "lucide-react";
import { handleError } from "../../core/utils/error-handler.ts";

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) });

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            setLoading(true);
            await userAuthService.forgotPassword(data.email);
            setSent(true);
            toast.success("Reset OTP sent to your email");
        } catch (err) {
            handleError(err, "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        navigate("/user/reset-password", { state: { email: getValues("email") } });
    };

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
                    <>
                        <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Forgot password?</h1>
                        <p className="text-brand-900/60 text-sm mb-8">
                            Enter your email and we'll send you a reset code.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <Input
                                label="Email address"
                                type="email"
                                placeholder="you@example.com"
                                error={errors.email?.message}
                                {...register("email")}
                            />
                            <Button type="submit" loading={loading} className="mt-2">
                                Send reset code
                            </Button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Code sent!</h1>
                        <p className="text-brand-900/60 text-sm mb-8">
                            We've sent a 6-digit OTP to{" "}
                            <span className="text-brand-600 font-mono">{getValues("email")}</span>.
                            Enter it on the next screen to reset your password.
                        </p>
                        <Button type="button" onClick={handleContinue}>
                            Continue to reset
                        </Button>
                    </>
                )}
            </div>
        </AuthLayout>
    );
};