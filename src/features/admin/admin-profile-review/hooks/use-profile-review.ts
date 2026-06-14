import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { profileService } from "../../../../services/api/profile.service.ts";
import type { Therapist } from "../../../../domain/model/index.ts";

export const getTherapistId = (therapist: Therapist | null): string => {
  if (!therapist) return "";
  return therapist.id || (therapist as { _id?: string })._id || "";
};

export const useProfileReview = () => {
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
        setPendingTherapists(res.data.therapists || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      await profileService.reviewTherapistUpdate(id, { status: "approved" });
      toast.success("Profile updates approved successfully");
      setPendingTherapists((prev) => prev.filter((t) => getTherapistId(t) !== id));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTherapist) return;
    if (!rejectionReason.trim()) {
        toast.error("Rejection reason is required");
        return;
    } 

    const id = getTherapistId(selectedTherapist);
    setIsProcessing(true);
    try {
      await profileService.reviewTherapistUpdate(id, {
        status: "rejected",
        reason: rejectionReason,
      });
      toast.success("Profile updates rejected");
      setPendingTherapists((prev) => prev.filter((t) => getTherapistId(t) !== id));
      closeRejectModal();
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectModal = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setRejectionReason("");
    setRejectionModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectionModalOpen(false);
    setRejectionReason("");
    setSelectedTherapist(null);
  };

  return {
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
  };
};