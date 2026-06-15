import { Input } from "../../../../components/common/Input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import type { RequestResetFormProps } from "../types/forgot-password.types.ts";

export const RequestResetForm = ({ onSubmit, register, errors, loading }: RequestResetFormProps) => (
    <>
        <h1 className="font-display text-3xl font-bold text-brand-900 mb-2">Forgot password?</h1>
        <p className="text-brand-900/60 text-sm mb-8">
            Enter your email and we'll send you a reset code.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
            />
            <Button type="submit" loading={loading} className="mt-2">
                Send reset code
            </Button>
        </form>
    </>
);