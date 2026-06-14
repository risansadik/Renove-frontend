import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminLoginSchema, type AdminLoginForm } from "../../../../core/utils/form-schemas.ts";
import { adminService } from "../../../../services/api/auth.service.ts";
import { useAuthStore } from "../../../../store/use-auth-store.ts";

export const useAdminLogin = () => {
    const navigate = useNavigate();
    const setAdmin = useAuthStore((s) => s.setAdmin);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminLoginForm>({ resolver: zodResolver(adminLoginSchema) });

    const onSubmit = async (data: AdminLoginForm) => {
        try {
            setLoading(true);
            const res = await adminService.login(data);
            const admin = res.data.data?.admin;
            if (admin) {
                setAdmin(admin);
                toast.success("Welcome, Admin!");
                navigate("/admin/dashboard");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        loading,
    };
};