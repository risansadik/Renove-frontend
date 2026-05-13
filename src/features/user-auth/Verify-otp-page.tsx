import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layout/Auth-layout.js";
import { OtpInput } from "../../components/common/Otp-input.js";
import { Button } from "../../components/common/Button.js";
import { userAuthService, therapistAuthService } from "../../services/api/auth.service.js";
import { Mail } from "lucide-react";

interface VerifyOtpPageProps {
    role: "user" | "therapist";
}

export const VerifyOtpPage = ({ role }: VerifyOtpPageProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as { email?: string })?.email ?? "";

    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const service = role === "user" ? userAuthService : therapistAuthService;
    const loginPath = role === "user" ? "/user/login" : "/therapist/login";
    const canResend = countdown <= 0;

    useEffect(() => {
        if (!email) {
            navigate(role === "user" ? "/user/register" : "/therapist/register");
        }
    }, [email, navigate, role]);

    useEffect(() => {
        if (canResend) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [canResend]);

    const handleVerify = async () => {
        if (otp.length !== 6) { setOtpError("Enter the 6-digit OTP"); return; }
        setOtpError("");
        try {
            setLoading(true);
            await service.verifyOtp({ email, otp });
            toast.success("Email verified successfully!");
            navigate(loginPath, { state: { verified: true } });
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            await service.resendOtp(email);
            toast.success("OTP resent to your email");
            setCountdown(60);
            setOtp("");
            setOtpError("");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

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

                <OtpInput value={otp} onChange={setOtp} error={otpError} />

                <Button
                    type="button"
                    onClick={handleVerify}
                    loading={loading}
                    className="mt-8"
                    disabled={otp.length !== 6}
                >
                    Verify email
                </Button>

                <div className="mt-5 text-sm">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="text-brand-600 hover:text-brand-800 font-medium transition-colors disabled:opacity-50"
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>
                    ) : (
                        <span className="text-brand-900/40">
                            Resend code in{" "}
                            <span className="text-brand-900/60 font-mono">{String(countdown).padStart(2, "0")}s</span>
                        </span>
                    )}
                </div>

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
