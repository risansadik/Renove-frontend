import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
    type RegisterTherapistFormInput,
} from "../../core/utils/form-schemas.js";
import { therapistAuthService } from "../../services/api/auth.service.js";
import { ChevronLeft, ChevronRight, CheckCircle2, Upload, FileText, ImageIcon, X } from "lucide-react";
import { handleError } from "../../core/utils/error-handler.js";
import { Select } from "../../components/common/Select.js";
import { ImageCropper } from "../../components/common/ImageCropper.js";

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
    const [cropData, setCropData] = useState<{ url: string, type: 'profile' | 'cert', index?: number } | null>(null);
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [certFiles, setCertFiles] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<RegisterTherapistFormInput, unknown, RegisterTherapistForm>({
        resolver: zodResolver(registerTherapistSchema)
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cert') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setCropData({ url: reader.result as string, type });
            };
            reader.readAsDataURL(file);
        } else if (type === 'cert' && file.type === 'application/pdf') {
            const newCerts = [...certFiles, file].slice(0, 5);
            setCertFiles(newCerts);
            setValue('certificationFiles', newCerts, { shouldValidate: true });
        }
    };

    const onCropComplete = (blob: Blob) => {
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        if (cropData?.type === 'profile') {
            setProfileFile(file);
            setValue('profileImage', file, { shouldValidate: true });
        } else {
            const newCerts = [...certFiles, file].slice(0, 5);
            setCertFiles(newCerts);
            setValue('certificationFiles', newCerts, { shouldValidate: true });
        }
        setCropData(null);
    };

    const step0Fields: (keyof RegisterTherapistFormInput)[] = ["name", "email", "password", "confirmPassword", "gender", "profileImage"];
    const step1Fields: (keyof RegisterTherapistFormInput)[] = ["qualification", "specialization", "experience", "consultationFee", "certificationFiles"];
    const step2Fields: (keyof RegisterTherapistFormInput)[] = ["bio"];

    const nextStep = async () => {
        const fields = [step0Fields, step1Fields, step2Fields][step];
        const valid = await trigger(fields);
        if (valid) setStep((s) => s + 1);
    };

    const onSubmit = async (data: RegisterTherapistForm) => {
        try {
            setLoading(true);
            const payload = toRegisterTherapistPayload(data);

            const res = await therapistAuthService.register(payload);
            toast.success("Registration submitted! Please verify your email.");
            navigate("/therapist/verify-otp", { state: { email: res.data.data?.email } });
        } catch (err) {
            handleError(err, "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout panel={<TherapistPanel />}>
            <div className="auth-card p-8 stagger-2">
                <div className="flex items-center gap-2 mb-8">
                    {STEPS.map((label, i) => (
                        <div key={i} className="flex items-center gap-2 flex-1">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step
                                        ? "bg-brand-500 text-white"
                                        : i === step
                                            ? "bg-brand-500/20 border-2 border-brand-500 text-brand-600"
                                            : "bg-brand-900/5 border border-brand-900/10 text-brand-900/30"
                                        }`}
                                >
                                    {i < step ? <CheckCircle2 size={14} /> : i + 1}
                                </div>
                                <span className={`text-xs hidden sm:block ${i === step ? "text-brand-900/80" : "text-brand-900/40"}`}>
                                    {label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-px flex-1 mx-1 ${i < step ? "bg-brand-500/50" : "bg-brand-900/10"}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">
                        {["Personal information", "Professional details", "About you"][step]}
                    </h1>
                    <p className="text-brand-900/60 text-sm">
                        {["Step 1 of 3 - Basic info", "Step 2 of 3 - Credentials", "Step 3 of 3 - Final details"][step]}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {step === 0 && (
                        <div className="flex flex-col gap-4">
                            <Input label="Full name" placeholder="Dr. Sarah Connor" error={errors.name?.message} {...register("name")} />
                            <Input label="Email address" type="email" placeholder="doctor@clinic.com" error={errors.email?.message} {...register("email")} />
                            <div className="grid grid-cols-2 gap-4">
                                <PasswordInput label="Password" placeholder="Enter password" error={errors.password?.message} {...register("password")} />
                                <PasswordInput label="Confirm password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
                            </div>

                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Gender"
                                        error={errors.gender?.message}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        name={field.name}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Prefer not to say</option>
                                    </Select>
                                )}
                            />
                            <div className="space-y-2">
                                <label className="label">Profile image</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center overflow-hidden shrink-0">
                                        {profileFile ? (
                                            <img src={URL.createObjectURL(profileFile)} className="w-full h-full object-cover" alt="Profile" />
                                        ) : (
                                            <ImageIcon size={24} className="text-brand-500/20" />
                                        )}
                                    </div>
                                    <label className="flex-1 cursor-pointer">
                                        <div className="btn-outline text-xs py-2 h-auto">
                                            <Upload size={14} className="mr-2" />
                                            {profileFile ? "Change image" : "Choose image"}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileSelect(e, 'profile')}
                                        />
                                    </label>
                                </div>
                                {errors.profileImage && <p className="error-text">Profile image is required</p>}
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Highest qualification"
                                placeholder="e.g. M.D. Psychiatry, Ph.D. Psychology"
                                error={errors.qualification?.message}
                                {...register("qualification")}
                            />

                            <Input
                                label="Specializations"
                                placeholder="e.g. Addiction, PTSD, Recovery (comma separated)"
                                error={errors.specialization?.message}
                                {...register("specialization")}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Experience (years)" type="number" placeholder="5" error={errors.experience?.message} {...register("experience")} />
                                <Input label="Session fee ($)" type="number" placeholder="100" error={errors.consultationFee?.message} {...register("consultationFee")} />
                            </div>

                            <div className="space-y-2">
                                <label className="label text-brand-900/40 dark:text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2 block">Certification documents (Max 5)</label>
                                <div className="flex flex-wrap gap-3">
                                    {certFiles.map((file, i) => (
                                        <div key={i} className="group relative w-16 h-16 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center overflow-hidden">
                                            {file.type === 'application/pdf' ? (
                                                <FileText className="text-brand-500/40" />
                                            ) : (
                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Cert" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setCertFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute inset-0 bg-brand-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {certFiles.length < 5 && (
                                        <label className="w-16 h-16 rounded-2xl bg-brand-500/5 border-2 border-dashed border-brand-500/20 hover:border-brand-500/40 flex items-center justify-center cursor-pointer transition-all">
                                            <Upload size={20} className="text-brand-500/40" />
                                            <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileSelect(e, 'cert')} />
                                        </label>
                                    )}
                                </div>
                                {errors.certificationFiles && <p className="error-text">Certification documents are required</p>}
                            </div>
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
                                <p className="text-yellow-600/90 text-xs leading-relaxed">
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

                {cropData && (
                    <ImageCropper
                        image={cropData.url}
                        title={cropData.type === 'profile' ? "Crop Profile Picture" : "Crop Certification Image"}
                        aspectRatio={cropData.type === 'profile' ? 1 : 1.414} // Square for profile, A4-ish for certs
                        onCrop={onCropComplete}
                        onCancel={() => setCropData(null)}
                    />
                )}

                <p className="text-center text-brand-900/40 text-xs mt-6">
                    Already registered?{" "}
                    <Link to="/therapist/login" className="text-brand-900/60 hover:text-brand-900/80 transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};
