import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPasswordSchema, type ResetPasswordForm } from "../../../../core/utils/form-schemas.ts";
import { userAuthService } from "../../../../services/api/auth.service.ts";

export const useResetPassword = () => {
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
            navigate("/user/forgot-password", { replace: true });
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
            await userAuthService.forgotPassword(email);
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
            await userAuthService.verifyResetOtp({ email, otp });
            setStep("password");
            toast.success("Code verified! Set your new password.");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            setLoading(true);
            await userAuthService.resetPassword(data);
            toast.success("Password reset successfully!");
            navigate("/user/login");
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        step,
        control,
        register,
        errors,
        loading,
        resending,
        countdown,
        canResend,
        handleVerifyOtp,
        handleResendOtp,
        handleSubmit: handleSubmit(onSubmit),
    };
};