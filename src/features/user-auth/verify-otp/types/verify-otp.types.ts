export interface OtpFormProps {
    otp: string;
    setOtp: (val: string) => void;
    otpError: string;
    loading: boolean;
    resending: boolean;
    countdown: number;
    canResend: boolean;
    handleVerify: () => Promise<void>;
    handleResend: () => Promise<void>;
}