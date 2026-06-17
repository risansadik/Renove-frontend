import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  registerTherapistSchema,
  toRegisterTherapistPayload,
  type RegisterTherapistForm,
  type RegisterTherapistFormInput,
} from "../../../../core/utils/form-schemas.ts";
import { therapistAuthService } from "../../../../services/api/auth.service.ts";

export const useTherapistRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cropData, setCropData] = useState<{ url: string; type: "profile" | "cert"; index?: number } | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [certFiles, setCertFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterTherapistFormInput, unknown, RegisterTherapistForm>({
    resolver: zodResolver(registerTherapistSchema),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cert") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropData({ url: reader.result as string, type });
      };
      reader.readAsDataURL(file);
    } else if (type === "cert" && file.type === "application/pdf") {
      const newCerts = [...certFiles, file].slice(0, 5);
      setCertFiles(newCerts);
      setValue("certificationFiles", newCerts, { shouldValidate: true });
    }
  };

  const onCropComplete = (blob: Blob) => {
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    if (cropData?.type === "profile") {
      setProfileFile(file);
      setValue("profileImage", file, { shouldValidate: true });
    } else {
      const newCerts = [...certFiles, file].slice(0, 5);
      setCertFiles(newCerts);
      setValue("certificationFiles", newCerts, { shouldValidate: true });
    }
    setCropData(null);
  };

  const removeCert = (idx: number) => {
    const updated = certFiles.filter((_, i) => i !== idx);
    setCertFiles(updated);
    setValue("certificationFiles", updated, { shouldValidate: true });
  };

  const nextStep = async () => {
    const step0Fields: (keyof RegisterTherapistFormInput)[] = ["name", "email", "password", "confirmPassword", "gender", "profileImage"];
    const step1Fields: (keyof RegisterTherapistFormInput)[] = ["qualification", "specialization", "experience", "consultationFee", "certificationFiles"];
    const step2Fields: (keyof RegisterTherapistFormInput)[] = ["bio"];

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
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    const firstError = Object.values(formErrors)[0];
    if (firstError?.message) {
      toast.error(firstError.message as string);
    }
  };

  return {
    step,
    setStep,
    loading,
    cropData,
    setCropData,
    profileFile,
    certFiles,
    register,
    control,
    errors,
    onCropComplete,
    handleFileSelect,
    removeCert,
    nextStep,
    handleSubmit: handleSubmit(onSubmit, onInvalid),
  };
};