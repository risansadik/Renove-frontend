import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { profileService } from "../../services/api/profile.service.ts";
import { Button } from "../../components/common/Button.tsx";
import { ConfirmationModal } from "../../components/common/Confirmation-modal.tsx";
import { AlertCircle, CheckCircle, FileCheck } from "lucide-react";
import type { Therapist } from "../../domain/model/index.ts";

export const AdminProfileReviewPage = () => {
  const [pendingTherapists, setPendingTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const res = await profileService.getPendingTherapistUpdates();
      if (res.success && res.data) {
        setPendingTherapists(res.data.therapists);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Failed to fetch pending updates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPending();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      await profileService.reviewTherapistUpdate(id, { status: "approved" });
      toast.success("Profile updates approved successfully");
      setPendingTherapists(prev => prev.filter(t => (t.id || (t as { _id?: string })._id) !== id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Failed to approve updates");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTherapist) return;
    if (!rejectionReason.trim()) return toast.error("Rejection reason is required");

    const id = selectedTherapist.id || (selectedTherapist as { _id?: string })._id || "";
    setIsProcessing(true);
    try {
      await profileService.reviewTherapistUpdate(id, {
        status: "rejected",
        reason: rejectionReason
      });
      toast.success("Profile updates rejected");
      setPendingTherapists(prev => prev.filter(t => (t.id || (t as { _id?: string })._id) !== id));
      setRejectionModalOpen(false);
      setRejectionReason("");
      setSelectedTherapist(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Failed to reject updates");
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectModal = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setRejectionReason("");
    setRejectionModalOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center text-brand-900/50">Loading pending reviews...</div>;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
          <FileCheck className="text-primary-500" /> Pending Profile Reviews
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>Review and approve professional information updates from therapists.</p>
      </div>

      {pendingTherapists.length === 0 ? (
        <div className="p-12 text-center rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500 mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--fg-primary)" }}>All caught up!</h2>
          <p className="text-sm mt-2" style={{ color: "var(--fg-muted)" }}>There are no pending profile updates to review right now.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingTherapists.map(therapist => {
            const updates = therapist.pendingUpdates || {};

            return (
            <div key={therapist.id || (therapist as { _id?: string })._id} className="p-6 rounded-2xl flex flex-col xl:flex-row gap-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
                {/* Current Profile Preview */}
                <div className="xl:w-1/3 space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={therapist.profileImage || `https://ui-avatars.com/api/?name=${therapist.name}`} alt={therapist.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold" style={{ color: "var(--fg-primary)" }}>{therapist.name}</h3>
                      <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{therapist.email}</p>
                    </div>
                  </div>
                </div>

                {/* Pending Changes Diff view (Simplified) */}
                <div className="xl:w-2/3 space-y-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--accent-primary)" }}>
                    <AlertCircle size={16} /> Pending Updates
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(updates).map(([key, newValue]) => (
                      <div key={key} className="p-3 rounded-lg" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
                        <p className="text-xs font-bold capitalize mb-1" style={{ color: "var(--fg-muted)" }}>{key}</p>

                        <div className="flex flex-col gap-1 text-sm">
                          <div className="line-through opacity-50" style={{ color: "var(--fg-primary)" }}>
                            {(therapist as unknown as Record<string, unknown>)[key] ? String((therapist as unknown as Record<string, unknown>)[key]) : "None"}
                          </div>
                          <div className="text-emerald-500 font-medium">
                            {Array.isArray(newValue) ? newValue.join(", ") : String(newValue)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/5 hover:border-red-500/50" onClick={() => openRejectModal(therapist)} loading={isProcessing} disabled={isProcessing}>
                      Reject
                    </Button>
                    <Button variant="primary" onClick={() => handleApprove(therapist.id || (therapist as { _id?: string })._id || "")} loading={isProcessing} disabled={isProcessing}>
                      Approve Updates
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejectionModalOpen && selectedTherapist && (
        <ConfirmationModal
          isOpen={rejectionModalOpen}
          title="Reject Profile Update"
          description={`Please provide a reason for rejecting the updates from ${selectedTherapist.name}. They will be able to see this reason.`}
          onConfirm={handleReject}
          onClose={() => { setRejectionModalOpen(false); setRejectionReason(""); }}
          confirmText="Reject Updates"
          isDestructive={true}
        >
          <div className="mt-4">
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border outline-none text-sm"
              style={{ background: "var(--bg-input)", borderColor: "var(--border-default)", color: "var(--fg-primary)" }}
              placeholder="E.g. The provided certifications are not valid."
            />
          </div>
        </ConfirmationModal>
      )}
    </div>
  );
};
