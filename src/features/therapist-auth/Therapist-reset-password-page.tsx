import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layout/Auth-layout.tsx";
import { PasswordInput } from "../../components/common/Password-input.tsx";
import { OtpInput } from "../../components/common/Otp-input.tsx";
import { Button } from "../../components/common/Button.tsx";
import { resetPasswordSchema, type ResetPasswordForm } from "../../core/utils/form-schemas.ts";
import { therapistAuthService } from "../../services/api/auth.service.ts";
import { ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

const TherapistPanel = () => (
    <div>
        <p className="text-brand-400 text-sm font-mono mb-4 tracking-widest uppercase">Therapist portal</p>
        <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
            Secure<br />
            <span className="text-brand-400">Reset.</span>
        </h2>
        <p className="text-white/50 text-base leading-relaxed">
            Verify your identity with the OTP sent to your email and set a new password.
        </p>
    </div>
);

export const TherapistResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as { email?: string })?.email ?? "";
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [step, setStep] = useState<"otp" | "password">("otp");
    const [countdown, setCountdown] = useState(60);
    const canResend = countdown <= 0;

    const {
        control,
        register,
        handleSubmit,
        trigger,
        getValues,
        formState: { errors },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email,
            otp: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!email) {
            navigate("/therapist/forgot-password", { replace: true });
        }
    }, [email, navigate]);

    useEffect(() => {
        if (canResend || step !== "otp") return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [canResend, step, countdown]);

    const handleResendOtp = async () => {
        try {
            setResending(true);
            await therapistAuthService.forgotPassword(email);
            toast.success("New code sent to your email");
            setCountdown(60);
        } finally {
            setResending(false);
        }
    };

    const handleVerifyOtp = async () => {
        const isValid = await trigger("otp");
        if (!isValid) return;

        try {
            setLoading(true);
            const otp = getValues("otp");
            await therapistAuthService.verifyResetOtp({ email, otp });
            setStep("password");
            toast.success("Code verified! Set your new password.");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            setLoading(true);
            await therapistAuthService.resetPassword(data);
            toast.success("Password reset successfully!");
            navigate("/therapist/login");
        }finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout panel={<TherapistPanel />}>
            <div className="auth-card p-8 stagger-2">
                <Link
                    to="/therapist/forgot-password"
                    className="inline-flex items-center gap-2 text-brand-900/60 hover:text-brand-900/80 text-sm mb-8 transition-colors"
                >
                    <ArrowLeft size={14} /> Back
                </Link>

                <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-6">
                    <ShieldCheck size={24} className="text-brand-600" />
                </div>

                <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">
                        {step === "otp" ? "Verify Code" : "New Password"}
                    </h1>
                    <p className="text-brand-900/60 text-sm">
                        {step === "otp" ? (
                            <>Enter the 6-digit code sent to <span className="text-brand-600 font-mono text-xs">{email}</span></>
                        ) : (
                            "Create a strong new password for your professional account."
                        )}
                    </p>
                </div>

                {step === "otp" ? (
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="label mb-3 text-brand-900/60">Verification code</p>
                            <Controller
                                name="otp"
                                control={control}
                                render={({ field }) => (
                                    <OtpInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.otp?.message}
                                    />
                                )}
                            />
                        </div>
                        <Button type="button" onClick={handleVerifyOtp} loading={loading}>
                            Verify Code
                        </Button>

                        <div className="text-center">
                            {canResend ? (
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resending}
                                    className="text-brand-600 hover:text-brand-800 text-sm font-medium transition-colors"
                                >
                                    {resending ? "Resending..." : "Resend code"}
                                </button>
                            ) : (
                                <span className="text-brand-900/40 text-sm">
                                    Resend code in <span className="text-brand-900/60 font-mono">{countdown}s</span>
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <div className="p-3 bg-sage-50 border border-sage-200 rounded-xl flex items-center gap-3 mb-2">
                            <CheckCircle2 size={18} className="text-sage-600" />
                            <span className="text-xs text-sage-800 font-medium">Email verified successfully</span>
                        </div>

                        <PasswordInput
                            label="New password"
                            placeholder="Min 8 chars, uppercase & number"
                            error={errors.newPassword?.message}
                            {...register("newPassword")}
                        />
                        <PasswordInput
                            label="Confirm new password"
                            placeholder="Repeat your new password"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />

                        <Button type="submit" loading={loading} className="mt-2">
                            Reset password
                        </Button>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};
