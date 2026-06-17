import {  Controller } from "react-hook-form";
import { ImageIcon, Upload } from "lucide-react";
import { Input } from "../../../../components/common/Input.tsx";
import { PasswordInput } from "../../../../components/common/Password-input.tsx";
import { Select } from "../../../../components/common/Select.tsx";
import type { StepPersonalInfoProps } from "../types/register-page.types.ts";


export const StepPersonalInfo = ({ register, control, errors, profileFile, onFileSelect }: StepPersonalInfoProps) => (
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
          value={field.value ?? ""}
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
          <input type="file" className="hidden" accept="image/*" onChange={(e) => onFileSelect(e, "profile")} />
        </label>
      </div>
      {errors.profileImage && <p className="error-text">Profile image is required</p>}
    </div>
  </div>
);