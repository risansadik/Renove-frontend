import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSchema, type LoginForm } from "../../../../core/utils/form-schemas.ts";
import { therapistAuthService } from "../../../../services/api/auth.service.ts";
import { useAuthStore } from "../../../../store/use-auth-store.ts";

export const useTherapistLogin = () => {
  const navigate = useNavigate();
  const setTherapist = useAuthStore((s) => s.setTherapist);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const blockedReason = sessionStorage.getItem("blocked_reason");
    if (blockedReason) {
      toast.error(blockedReason, { id: "blocked-toast", duration: 6000 });
      sessionStorage.removeItem("blocked_reason");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const res = await therapistAuthService.login(data);
      const therapist = res.data.data?.therapist;
      if (therapist) {
        setTherapist(therapist);
        toast.success(`Welcome back, ${therapist.name}!`);
        navigate("/therapist/dashboard");
      }
    } finally{
      setLoading(false);
    }
  };

  return {
    loading,
    register,
    errors,
    handleSubmit: handleSubmit(onSubmit),
  };
};