import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layout/Auth-layout.js";
import { Input } from "../../components/common/Input.js";
import { PasswordInput } from "../../components/common/Password-input.js";
import { Button } from "../../components/common/Button.js";
import {
    registerTherapistSchema,
    toRegisterTherapistPayload,
    type RegisterTherapistForm,
} from "../../core/utils/form-schemas.js";
import { therapistAuthService } from "../../services/api/auth.service.js";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const STEPS = ["Personal info", "Professional details", "About you"];

const TherapistPanel = () => (
    <div>
        <p className="text-brand-400 text-sm font-mono mb-4 tracking-widest uppercase">For therapists</p>
        <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
            Join our network of{" "}
            <span className="text-brand-400">recovery experts.</span>
        </h2>
        <p className="text-white/50 text-base leading-relaxed mb-10">
            Help users on their journey to freedom. Our admin team reviews every application
            to maintain the quality of our platform.
        </p>
        <div className="flex flex-col gap-3">
            {[
                "Submit your credentials & qualifications",
                "Admin reviews your application",
                "Get approved and go live",
                "Manage sessions from your dashboard",
            ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-brand-400 text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-white/50 text-sm">{step}</span>
                </div>
            ))}
        </div>
    </div>
);

export const TherapistRegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<RegisterTherapistForm>({ resolver: zodResolver(registerTherapistSchema) });

    const step0Fields: (keyof RegisterTherapistForm)[] = ["name", "email", "password", "phone", "gender"];
    const step1Fields: (keyof RegisterTherapistForm)[] = ["qualification", "specialization", "experience", "consultationFee"];
    const step2Fields: (keyof RegisterTherapistForm)[] = ["bio"];

    const nextStep = async () => {
        const fields = [step0Fields, step1Fields, step2Fields][step];
        const valid = await trigger(fields);
        if (valid) setStep((s) => s + 1);
    };

    const onSubmit = async (data: RegisterTherapistForm) => {
        try {
            setLoading(true);
            const res = await therapistAuthService.register(toRegisterTherapistPayload(data));
            toast.success("Registration submitted! Please verify your email.");
            navigate("/therapist/verify-otp", { state: { email: res.data.data?.email } });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout panel={<TherapistPanel />}>
            <div className="auth-card p-8">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-8">
                    {STEPS.map((label, i) => (
                        <div key={i} className="flex items-center gap-2 flex-1">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step
                                            ? "bg-brand-500 text-white"
                                            : i === step
                                                ? "bg-brand-500/20 border-2 border-brand-500 text-brand-400"
                                                : "bg-white/5 border border-white/10 text-white/30"
                                        }`}
                                >
                                    {i < step ? <CheckCircle2 size={14} /> : i + 1}
                                </div>
                                <span className={`text-xs hidden sm:block ${i === step ? "text-white/70" : "text-white/25"}`}>
                                    {label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-px flex-1 mx-1 ${i < step ? "bg-brand-500/50" : "bg-white/10"}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h1 className="font-display text-2xl font-bold text-white mb-1">
                        {["Personal information", "Professional details", "About you"][step]}
                    </h1>
                    <p className="text-white/35 text-sm">
                        {["Step 1 of 3 - Basic info", "Step 2 of 3 - Credentials", "Step 3 of 3 - Final details"][step]}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Step 0 */}
                    {step === 0 && (
                        <div className="flex flex-col gap-4">
                            <Input label="Full name" placeholder="Dr. Sarah Connor" error={errors.name?.message} {...register("name")} />
                            <Input label="Email address" type="email" placeholder="doctor@clinic.com" error={errors.email?.message} {...register("email")} />
                            <PasswordInput label="Password" placeholder="Min 8 chars, uppercase & number" error={errors.password?.message} {...register("password")} />
                            <Input label="Phone number" type="tel" placeholder="+91 9876543210" error={errors.phone?.message} {...register("phone")} />
                            <div>
                                <label className="label">Gender</label>
                                <select
                                    className={`input-field ${errors.gender ? "error" : ""}`}
                                    {...register("gender")}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Prefer not to say</option>
                                </select>
                                {errors.gender && <p className="error-text">{errors.gender.message}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Qualification"
                                placeholder="e.g. M.D. Psychiatry, Ph.D. Psychology"
                                error={errors.qualification?.message}
                                {...register("qualification")}
                            />
                            <Input
                                label="Specializations (comma-separated)"
                                placeholder="e.g. Addiction Recovery, Anxiety, Depression"
                                error={errors.specialization?.message}
                                {...register("specialization")}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Years of experience"
                                    type="number"
                                    min={0}
                                    placeholder="5"
                                    error={errors.experience?.message}
                                    {...register("experience")}
                                />
                                <Input
                                    label="Consultation fee (INR)"
                                    type="number"
                                    min={0}
                                    placeholder="500"
                                    error={errors.consultationFee?.message}
                                    {...register("consultationFee")}
                                />
                            </div>
                            <Input
                                label="Certifications (comma-separated, optional)"
                                placeholder="e.g. CBT Certified, EMDR Trained"
                                error={errors.certifications?.message}
                                {...register("certifications")}
                            />
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="label">Professional bio</label>
                                <textarea
                                    rows={6}
                                    placeholder="Tell users about your approach, experience, and how you help people in recovery... (min 50 characters)"
                                    className={`input-field resize-none ${errors.bio ? "error" : ""}`}
                                    {...register("bio")}
                                />
                                {errors.bio && <p className="error-text">{errors.bio.message}</p>}
                            </div>

                            <div className="p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-xl">
                                <p className="text-yellow-400/70 text-xs leading-relaxed">
                                    After submitting, your profile will be reviewed by our admin team.
                                    This process may take 1-2 business days. You'll be notified via email.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 mt-6">
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={() => setStep((s) => s - 1)}
                                className="btn-outline flex-none w-auto px-4"
                            >
                                <ChevronLeft size={16} />
                            </button>
                        )}

                        {step < STEPS.length - 1 ? (
                            <button type="button" onClick={nextStep} className="btn-primary flex-1">
                                Continue <ChevronRight size={16} />
                            </button>
                        ) : (
                            <Button type="submit" loading={loading} className="flex-1">
                                Submit application
                            </Button>
                        )}
                    </div>
                </form>

                <p className="text-center text-white/25 text-xs mt-6">
                    Already registered?{" "}
                    <Link to="/therapist/login" className="text-white/45 hover:text-white/65 transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};
