import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Input } from "../../components/common/Input.tsx";
import { PasswordInput } from "../../components/common/Password-input.tsx";
import { Button } from "../../components/common/Button.tsx";
import { adminLoginSchema, type AdminLoginForm } from "../../core/utils/form-schemas.ts";
import { adminService } from "../../services/api/auth.service.ts";
import { useAuthStore } from "../../store/use-auth-store.ts";
import { ShieldCheck, Sparkles } from "lucide-react";
import { handleError } from "../../core/utils/error-handler.ts";

export const AdminLoginPage = () => {
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
        } catch (err) {
            handleError(err, "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-brand-600/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-sm animate-fade-up relative z-10 stagger-1">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/20 mb-4">
                        <ShieldCheck size={22} className="text-brand-600" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center">
                            <Sparkles size={11} className="text-white" />
                        </div>
                        <span className="font-display font-bold text-lg text-brand-900">reNove</span>
                    </div>
                    <p className="text-brand-900/60 text-xs tracking-widest uppercase font-mono">Admin Portal</p>
                </div>

                <div className="auth-card p-8 stagger-2">
                    <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">Admin sign in</h1>
                    <p className="text-brand-900/60 text-sm mb-7">Restricted access - authorized personnel only.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input
                            label="Admin email"
                            type="email"
                            placeholder="admin@renove.com"
                            error={errors.email?.message}
                            {...register("email")}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Admin password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <Button type="submit" loading={loading} className="mt-2">
                            Access admin panel
                        </Button>
                    </form>
                </div>

                <p className="text-center text-brand-900/40 text-xs mt-6 stagger-3">
                    This portal is restricted to platform administrators only.
                </p>
            </div>
        </div>
    );
};
