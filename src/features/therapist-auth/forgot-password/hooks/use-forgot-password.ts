import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordSchema, type ForgotPasswordForm } from "../../../../core/utils/form-schemas.ts";
import { therapistAuthService } from "../../../../services/api/auth.service.ts";

export const useTherapistForgotPassword = () => {
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
      await therapistAuthService.forgotPassword(data.email);
      setSent(true);
      toast.success("Reset OTP sent to your email");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/therapist/reset-password", { state: { email: getValues("email") } });
  };

  return {
    loading,
    sent,
    register,
    errors,
    getValues,
    handleSubmit: handleSubmit(onSubmit),
    handleContinue,
  };
};