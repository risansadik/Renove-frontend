import { Mail } from "lucide-react";
import { useVerifyOtp } from "../hooks/use-verify-otp";
import { AuthLayout } from "../../../../components/layout/Auth-layout";
import { OtpForm } from "../components/Otp-form";

interface VerifyOtpPageProps {
    role: "user" | "therapist";
}

export const VerifyOtpPage = ({ role }: VerifyOtpPageProps) => {
    const {
        email,
        otp,
        setOtp,
        otpError,
        loading,
        resending,
        countdown,
        canResend,
        handleVerify,
        handleResend
    } = useVerifyOtp(role);

    return (
        <AuthLayout>
            <div className="auth-card p-8 text-center stagger-2">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
                    <Mail size={24} className="text-brand-600" />
                </div>

                <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Check your email</h1>
                <p className="text-brand-900/60 text-sm mb-2">
                    We sent a 6-digit code to
                </p>
                <p className="text-brand-600 font-medium text-sm mb-8 font-mono">{email}</p>

                <OtpForm
                    otp={otp}
                    setOtp={setOtp}
                    otpError={otpError}
                    loading={loading}
                    resending={resending}
                    countdown={countdown}
                    canResend={canResend}
                    handleVerify={handleVerify}
                    handleResend={handleResend}
                />

                {role === "therapist" && (
                    <div className="mt-6 p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl">
                        <p className="text-brand-900/60 text-xs leading-relaxed">
                            After verification, your profile will be reviewed by our admin team.
                            You'll receive an email once approved.
                        </p>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};