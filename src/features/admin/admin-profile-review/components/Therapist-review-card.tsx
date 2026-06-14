import { AlertCircle } from "lucide-react";
import { Button } from "../../../../components/common/Button.tsx";
import { getTherapistId } from "../hooks/use-profile-review";
import type { TherapistReviewCardProps } from "../types/admin-profile-review.types.ts";

export const TherapistReviewCard = ({
  therapist,
  isProcessing,
  onApprove,
  onRejectClick,
}: TherapistReviewCardProps) => {
  const updates = therapist.pendingUpdates || {};
  const id = getTherapistId(therapist);

  return (
    <div className="p-6 rounded-2xl flex flex-col xl:flex-row gap-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
      {/* Current Profile Identity */}
      <div className="xl:w-1/3 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={therapist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(therapist.name || "")}`}
            alt={therapist.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold" style={{ color: "var(--fg-primary)" }}>{therapist.name}</h3>
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{therapist.email}</p>
          </div>
        </div>
      </div>

      {/* Changeset Delta Grid Comparison */}
      <div className="xl:w-2/3 space-y-4">
        <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--accent-primary)" }}>
          <AlertCircle size={16} /> Pending Updates
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(updates).map(([key, newValue]) => {
            const oldValue = (therapist as unknown as Record<string, unknown>)[key];
            return (
              <div key={key} className="p-3 rounded-lg" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
                <p className="text-xs font-bold capitalize mb-1" style={{ color: "var(--fg-muted)" }}>{key}</p>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="line-through opacity-50" style={{ color: "var(--fg-primary)" }}>
                    {oldValue ? String(oldValue) : "None"}
                  </div>
                  <div className="text-emerald-500 font-medium">
                    {Array.isArray(newValue) ? newValue.join(", ") : String(newValue)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Action Controls */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/5 hover:border-red-500/50 disabled:opacity-50 transition-colors font-medium"
            onClick={() => onRejectClick(therapist)}
            disabled={isProcessing}
          >
            Reject
          </button>
          <Button
            variant="primary"
            onClick={() => onApprove(id)}
            loading={isProcessing}
            disabled={isProcessing}
          >
            Approve Updates
          </Button>
        </div>
      </div>
    </div>
  );
};