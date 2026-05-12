import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[0-9]/, "Must contain number");

const emailSchema = z.string().email("Invalid email address");
const otpSchema = z.string().length(6, "OTP must be 6 digits");

const splitCsv = (value?: string): string[] | undefined => {
  const items = value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return items?.length ? items : undefined;
};

export const registerUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerTherapistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().min(10, "Enter a valid phone number").max(15),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Select gender" }),
  }),
  qualification: z.string().min(2, "Enter your qualification"),
  specialization: z.string().min(2, "Enter at least one specialization"),
  experience: z.coerce.number().min(0, "Invalid experience").max(60),
  consultationFee: z.coerce.number().min(0, "Invalid fee"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000),
  certifications: z.string().optional(),
});

export const adminLoginSchema = loginSchema;

export type RegisterUserForm = z.infer<typeof registerUserSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type VerifyOtpForm = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type RegisterTherapistForm = z.infer<typeof registerTherapistSchema>;
export type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export const toRegisterTherapistPayload = (form: RegisterTherapistForm) => ({
  ...form,
  specialization: splitCsv(form.specialization) ?? [],
  certifications: splitCsv(form.certifications),
});
