import { FileCheck } from "lucide-react";
import { useProfileReview } from "../hooks/use-profile-review";
import { EmptyReviewState } from "../components/Empty-review-state"
import { TherapistReviewCard } from "../components/Therapist-review-card";
import { RejectionReasonModal } from "../components/Rejection-reason-modal";

export const AdminProfileReviewPage = () => {
  const {
    pendingTherapists,
    isLoading,
    selectedTherapist,
    rejectionModalOpen,
    rejectionReason,
    setRejectionReason,
    isProcessing,
    handleApprove,
    handleReject,
    openRejectModal,
    closeRejectModal,
  } = useProfileReview();

  if (isLoading) {
    return <div className="p-8 text-center text-brand-900/50">Loading pending reviews...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Title Header Block */}
      <div>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
          <FileCheck className="text-primary-500" /> Pending Profile Reviews
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
          Review and approve professional information updates from therapists.
        </p>
      </div>

      {/* Main Composite Conditonal Body */}
      {pendingTherapists.length === 0 ? (
        <EmptyReviewState />
      ) : (
        <div className="space-y-6">
          {pendingTherapists.map((therapist) => (
            <TherapistReviewCard
              key={therapist.id || (therapist as { _id?: string })._id}
              therapist={therapist}
              isProcessing={isProcessing}
              onApprove={handleApprove}
              onRejectClick={openRejectModal}
            />
          ))}
        </div>
      )}

      {/* Global Review Overlay Context */}
      <RejectionReasonModal
        isOpen={rejectionModalOpen}
        therapist={selectedTherapist}
        reason={rejectionReason}
        setReason={setRejectionReason}
        onConfirm={handleReject}
        onClose={closeRejectModal}
      />
    </div>
  );
};