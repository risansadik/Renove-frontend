import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layout/Auth-layout.js";
import { Input } from "../../components/common/Input.js";
import { PasswordInput } from "../../components/common/Password-input.js";
import { Button } from "../../components/common/Button.js";
import { loginSchema, type LoginForm } from "../../core/utils/form-schemas.js";
import { therapistAuthService } from "../../services/api/auth.service.js";
import { useAuthStore } from "../../store/use-auth-store.js";

const TherapistLoginPanel = () => (
    <div>
        <p className="text-brand-400 text-sm font-mono mb-4 tracking-widest uppercase">Therapist portal</p>
        <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
            Your dashboard<br />
            <span className="text-brand-400">awaits you.</span>
        </h2>
        <p className="text-white/50 text-base leading-relaxed">
            Access your consultation schedule, manage sessions, and connect with users on their recovery journey.
        </p>
        <div className="mt-10 p-4 bg-brand-500/5 border border-brand-500/15 rounded-xl">
            <p className="text-white/35 text-xs leading-relaxed">
                <span className="text-brand-400 font-medium">Note:</span> Only admin-approved therapists can log in.
                If your application is still under review, you'll receive an email once approved.
            </p>
        </div>
    </div>
);

export const TherapistLoginPage = () => {
    const navigate = useNavigate();
    const setTherapist = useAuthStore((s) => s.setTherapist);
    const [loading, setLoading] = useState(false);

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
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout panel={<TherapistLoginPanel />}>
            <div className="auth-card p-8">
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold text-white mb-2">Therapist sign in</h1>
                    <p className="text-white/40 text-sm">Access your therapist dashboard.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="doctor@clinic.com"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <Button type="submit" loading={loading} className="mt-2">
                        Sign in to dashboard
                    </Button>
                </form>

                <p className="text-center text-white/35 text-sm mt-6">
                    Not registered yet?{" "}
                    <Link to="/therapist/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                        Apply as a therapist
                    </Link>
                </p>

                <p className="text-center text-white/20 text-xs mt-3">
                    Are you a user?{" "}
                    <Link to="/user/login" className="text-white/40 hover:text-white/60 transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};