import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  loading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = "primary",
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const cls = variant === "primary" ? "btn-primary" : "btn-outline";
  return (
    <button className={`${cls} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <Loader2 size={18} className="animate-spin" /> : children}
    </button>
  );
};