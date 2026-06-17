import { CheckCircle2 } from "lucide-react";
import type { StepsIndicatorProps } from "../types/register-page.types";

export const RegistrationStepsIndicator = ({ currentStep, steps }: StepsIndicatorProps) => (
  <div className="flex items-center gap-2 mb-8">
    {steps.map((label, i) => (
      <div key={i} className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < currentStep
                ? "bg-brand-500 text-white"
                : i === currentStep
                  ? "bg-brand-500/20 border-2 border-brand-500 text-brand-600"
                  : "bg-brand-900/5 border border-brand-900/10 text-brand-900/30"
            }`}
          >
            {i < currentStep ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span className={`text-xs hidden sm:block ${i === currentStep ? "text-brand-900/80" : "text-brand-900/40"}`}>
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`h-px flex-1 mx-1 ${i < currentStep ? "bg-brand-500/50" : "bg-brand-900/10"}`} />
        )}
      </div>
    ))}
  </div>
);