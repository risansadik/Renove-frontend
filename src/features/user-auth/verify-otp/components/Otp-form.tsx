import { OtpInput } from "../../../../components/common/Otp-input.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import type { OtpFormProps } from "../types/verify-otp.types.ts";

export const OtpForm = ({
    otp,
    setOtp,
    otpError,
    loading,
    resending,
    countdown,
    canResend,
    handleVerify,
    handleResend
}: OtpFormProps) => (
    <>
        <OtpInput value={otp} onChange={setOtp} error={otpError} />

        <Button
            type="button"
            onClick={handleVerify}
            loading={loading}
            className="mt-8"
            disabled={otp.length !== 6}
        >
            Verify email
        </Button>

        <div className="mt-5 text-sm">
            {canResend ? (
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="text-brand-600 hover:text-brand-800 font-medium transition-colors disabled:opacity-50"
                >
                    {resending ? "Resending..." : "Resend OTP"}
                </button>
            ) : (
                <span className="text-brand-900/40">
                    Resend code in{" "}
                    <span className="text-brand-900/60 font-mono">
                        {String(countdown).padStart(2, "0")}s
                    </span>
                </span>
            )}
        </div>
    </>
);