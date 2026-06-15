import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userAuthService, therapistAuthService } from "../../../../services/api/auth.service.ts";

export const useVerifyOtp = (role: "user" | "therapist") => {
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
    }, [canResend, countdown]);

    const handleVerify = async () => {
        if (otp.length !== 6) { 
            setOtpError("Enter the 6-digit OTP"); 
            return; 
        }
        setOtpError("");
        try {
            setLoading(true);
            await service.verifyOtp({ email, otp });
            toast.success("Email verified successfully!");
            navigate(loginPath, { state: { verified: true } });
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
        } finally {
            setResending(false);
        }
    };

    return {
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
    };
};