import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layout/Auth-layout.js";
import { PasswordInput } from "../../components/common/Password-input.js";
import { OtpInput } from "../../components/common/Otp-input.js";
import { Button } from "../../components/common/Button.js";
import { resetPasswordSchema, type ResetPasswordForm } from "../../core/utils/form-schemas.js";
import { userAuthService } from "../../services/api/auth.service.js";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as { email?: string })?.email ?? "";
    const [loading, setLoading] = useState(false);

    const {
        control,
        register,
        handleSubmit,
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
            navigate("/user/forgot-password", { replace: true });
        }
    }, [email, navigate]);

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            setLoading(true);
            await userAuthService.resetPassword(data);
            toast.success("Password reset successfully!");
            navigate("/user/login");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="auth-card p-8">
                <Link
                    to="/user/forgot-password"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
                >
                    <ArrowLeft size={14} /> Back
                </Link>

                <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-6">
                    <ShieldCheck size={24} className="text-brand-400" />
                </div>

                <h1 className="font-display text-3xl font-bold text-white mb-2">Reset password</h1>
                <p className="text-white/40 text-sm mb-8">
                    Enter the OTP sent to{" "}
                    <span className="text-brand-400 font-mono text-xs">{email}</span>{" "}
                    and your new password.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div>
                        <p className="label mb-3">Verification code</p>
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
            </div>
        </AuthLayout>
    );
};
