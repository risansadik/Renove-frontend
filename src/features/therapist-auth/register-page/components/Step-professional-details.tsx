import { FileText, Upload, X } from "lucide-react";
import { Input } from "../../../../components/common/Input.tsx";
import type { StepProfessionalDetailsProps } from "../types/register-page.types.ts";

export const StepProfessionalDetails = ({
  register,
  errors,
  certFiles,
  onFileSelect,
  onRemoveCert,
}: StepProfessionalDetailsProps) => (
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
      <label className="label text-brand-900/40 dark:text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2 block">
        Certification documents (Max 5)
      </label>
      <div className="flex flex-wrap gap-3">
        {certFiles.map((file, i) => (
          <div key={i} className="group relative w-16 h-16 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center overflow-hidden">
            {file.type === "application/pdf" ? (
              <FileText className="text-brand-500/40" />
            ) : (
              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Cert" />
            )}
            <button
              type="button"
              onClick={() => onRemoveCert(i)}
              className="absolute inset-0 bg-brand-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {certFiles.length < 5 && (
          <label className="w-16 h-16 rounded-2xl bg-brand-500/5 border-2 border-dashed border-brand-500/20 hover:border-brand-500/40 flex items-center justify-center cursor-pointer transition-all">
            <Upload size={20} className="text-brand-500/40" />
            <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => onFileSelect(e, "cert")} />
          </label>
        )}
      </div>
      {errors.certificationFiles && <p className="error-text">Certification documents are required</p>}
    </div>
  </div>
);