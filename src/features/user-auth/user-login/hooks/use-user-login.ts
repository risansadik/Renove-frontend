import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { loginSchema, type LoginForm } from "../../../../core/utils/form-schemas.ts";
import { userAuthService } from "../../../../services/api/auth.service.ts";
import { useAuthStore } from "../../../../store/use-auth-store.ts";

export const useUserLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
      const res = await userAuthService.login(data);
      const user = res.data.data?.user;
      if (user) {
        setUser(user);
        toast.success(`Welcome back, ${user.name}!`);
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        const accessToken = tokenResponse.access_token;
        if (!accessToken) throw new Error("No access token received");

        const res = await userAuthService.googleAuth(accessToken);
        const user = res.data.data?.user;
        if (user) {
          setUser(user);
          toast.success(`Welcome back, ${user.name}!`);
          navigate("/dashboard");
        }
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error("Google login failed")
  });

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    loading,
    googleLoading,
    loginWithGoogle
  };
};