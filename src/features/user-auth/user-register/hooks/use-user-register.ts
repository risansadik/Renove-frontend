import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { registerUserSchema, type RegisterUserForm } from "../../../../core/utils/form-schemas.ts";
import { userAuthService } from "../../../../services/api/auth.service.ts";
import { useAuthStore } from "../../../../store/use-auth-store.ts";

export const useUserRegister = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserForm>({ resolver: zodResolver(registerUserSchema) });

  const onSubmit = async (data: RegisterUserForm) => {
    try {
      setLoading(true);
      const res = await userAuthService.register(data);
      toast.success("OTP sent to your email!");
      navigate("/user/verify-otp", { state: { email: res.data.data?.email } });
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
          toast.success(`Welcome, ${user.name}!`);
          navigate("/dashboard");
        }
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error("Google registration failed")
  });

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    loading,
    googleLoading,
    loginWithGoogle,
  };
};