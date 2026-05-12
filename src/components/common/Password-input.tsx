import { useState, forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./Input.js";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [show, setShow] = useState(false);
    const label = show ? "Hide password" : "Show password";

    return (
      <Input
        ref={ref}
        type={show ? "text" : "password"}
        rightElement={
          <button
            type="button"
            aria-label={label}
            title={label}
            onClick={() => setShow((s) => !s)}
            className="flex items-center justify-center"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
