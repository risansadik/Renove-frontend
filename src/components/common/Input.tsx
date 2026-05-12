import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightElement, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            className={`input-field ${error ? "error" : ""} ${rightElement ? "pr-11" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="error-text">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
