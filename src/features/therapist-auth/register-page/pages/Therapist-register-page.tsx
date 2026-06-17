import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AuthLayout } from "../../../../components/layout/Auth-layout.tsx";
import { Button } from "../../../../components/common/Button.tsx";
import { ImageCropper } from "../../../../components/common/ImageCropper.tsx";
import { useTherapistRegister } from "../hooks/use-register-page.ts";
import { TherapistRegisterPanel } from "../components/Therapist-register-panel.tsx";
import { RegistrationStepsIndicator } from "../components/Registration-steps-indicator.tsx";
import { StepPersonalInfo } from "../components/Step-personal-info.tsx";
import { StepProfessionalDetails } from "../components/Step-professional-details.tsx";
import { StepAboutYou } from "../components/Step-about-you.tsx";
import { STEP_SUBTITLES, STEP_TITLES, STEPS } from "../types/register-page.types.ts";

export const TherapistRegisterPage = () => {
  const {
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
    handleSubmit,
  } = useTherapistRegister();

  return (
    <AuthLayout panel={<TherapistRegisterPanel />}>
      <div className="auth-card p-8 stagger-2">
        <RegistrationStepsIndicator currentStep={step} steps={STEPS} />

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-brand-900 mb-1">{STEP_TITLES[step]}</h1>
          <p className="text-brand-900/60 text-sm">{STEP_SUBTITLES[step]}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <StepPersonalInfo
              register={register}
              control={control}
              errors={errors}
              profileFile={profileFile}
              onFileSelect={handleFileSelect}
            />
          )}

          {step === 1 && (
            <StepProfessionalDetails
              register={register}
              errors={errors}
              certFiles={certFiles}
              onFileSelect={handleFileSelect}
              onRemoveCert={removeCert}
            />
          )}

          {step === 2 && <StepAboutYou register={register} errors={errors} />}

          {/* Navigation Action Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-outline flex-none w-auto px-4">
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
            title={cropData.type === "profile" ? "Crop Profile Picture" : "Crop Certification Image"}
            aspectRatio={cropData.type === "profile" ? 1 : 1.414}
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

        <p className="text-center text-brand-900/40 text-xs mt-3">
          Are you a user?{" "}
          <Link to="/user/register" className="text-brand-900/60 hover:text-brand-900 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};