import { useAdminLogin } from "../hooks/use-admin-login";
import { AdminLoginHeader } from "../components/Admin-login-header";
import { AdminLoginForm } from "../components/Admin-login-form";

export const AdminLoginPage = () => {
    const { register, handleSubmit, errors, loading } = useAdminLogin();

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
            {/* Ambient Background Glow Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-brand-600/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-sm animate-fade-up relative z-10 stagger-1">
                <AdminLoginHeader />

                <AdminLoginForm
                    loading={loading}
                    errors={errors}
                    register={register}
                    onSubmit={handleSubmit}
                />

                <p className="text-center text-brand-900/40 text-xs mt-6 stagger-3">
                    This portal is restricted to platform administrators only.
                </p>
            </div>
        </div>
    );
};