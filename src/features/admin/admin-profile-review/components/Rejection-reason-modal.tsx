import { ConfirmationModal } from "../../../../components/common/Confirmation-modal.tsx";
import type { RejectionReasonModalProps } from "../types/admin-profile-review.types.ts";

export const RejectionReasonModal = ({
  isOpen,
  therapist,
  reason,
  setReason,
  onConfirm,
  onClose,
}: RejectionReasonModalProps) => {
  if (!isOpen || !therapist) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Reject Profile Update"
      description={`Please provide a reason for rejecting the updates from ${therapist.name}. They will be able to see this reason.`}
      onConfirm={onConfirm}
      onClose={onClose}
      confirmText="Reject Updates"
      isDestructive={true}
    >
      <div className="mt-4">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-xl border outline-none text-sm"
          style={{ background: "var(--bg-input)", borderColor: "var(--border-default)", color: "var(--fg-primary)" }}
          placeholder="E.g. The provided certifications are not valid."
        />
      </div>
    </ConfirmationModal>
  );
};