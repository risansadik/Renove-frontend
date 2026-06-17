import { User, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";
import type { ProfileStatusBannerProps } from "../types/therapist-profile.types";

export const ProfileStatusBanner = ({ therapist }: ProfileStatusBannerProps) => {
  const isReviewRequired = therapist.status === "review_required";
  const isRejected = therapist.status === "rejected";

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
            <User className="text-primary-500" /> Professional Profile
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>Manage your personal and professional marketplace information.</p>
        </div>

        <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${isReviewRequired
          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
          : isRejected
            ? "bg-red-500/10 text-red-500 border-red-500/20"
            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          }`}>
          {isReviewRequired ? <AlertTriangle size={16} /> : isRejected ? <AlertCircle size={16} /> : <ShieldCheck size={16} />}
          {isReviewRequired ? "Update Pending Admin Review" : isRejected ? "Profile Rejected" : "Approved & Public"}
        </div>
      </div>

      {isReviewRequired && (
        <div className="p-4 rounded-xl flex gap-3" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
          <AlertTriangle className="text-amber-500 shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-amber-600">Professional Updates Under Review</h3>
            <p className="text-sm text-amber-600/80 mt-1">
              Your recent changes to your professional information (bio, fee, qualifications) are being reviewed by our administration team.
              Your previously approved profile remains active and public until the new changes are approved.
            </p>
          </div>
        </div>
      )}

      {isRejected && therapist.adminRejectionReason && (
        <div className="p-4 rounded-xl flex gap-3" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-red-600">Profile Update Rejected</h3>
            <p className="text-sm text-red-600/80 mt-1">
              Reason: {therapist.adminRejectionReason}
            </p>
          </div>
        </div>
      )}
    </>
  );
};