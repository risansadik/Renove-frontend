import type { StepAboutYouProps } from "../types/register-page.types";

export const StepAboutYou = ({ register, errors }: StepAboutYouProps) => (
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
);