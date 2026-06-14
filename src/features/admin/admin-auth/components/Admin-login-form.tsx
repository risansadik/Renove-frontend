import { Input } from "../../../../components/common/Input.tsx";
import { PasswordInput } from "../../../../components/common/Password-input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import type { AdminLoginFormProps } from "../types/admin-auth.types.ts";


export const AdminLoginForm = ({ loading, errors, register, onSubmit }: AdminLoginFormProps) => {
    return (
        <div className="auth-card p-8 stagger-2">
            <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">Admin sign in</h1>
            <p className="text-brand-900/60 text-sm mb-7">Restricted access - authorized personnel only.</p>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
    );
};