import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userDashboardService } from "../../../../services/api/auth.service.ts";
import type { UseTherapistDetailsProps } from "../types/user-dashboard.types.ts";

export const useTherapistDetails = ({ therapist, isOpen, onRatingSaved }: UseTherapistDetailsProps) => {
  const [canReview, setCanReview] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [savingRating, setSavingRating] = useState(false);

  const getMediaUrl = (path: string | undefined) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_BASE_URL}/${path}`;
  };

  useEffect(() => {
    if (!isOpen || !therapist?.id) return;

    let active = true;
    setReviewLoading(true);
    userDashboardService.getTherapistReviewStatus(therapist.id)
      .then((response) => {
        if (!active) return;
        const status = response.data.data;
        setCanReview(status?.canReview ?? false);
        setUserRating(status?.userRating ?? null);
      })
      .finally(() => {
        if (active) setReviewLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, therapist?.id]);

  const handleRating = async (rating: number) => {
    if (!therapist || savingRating) return;

    setSavingRating(true);
    try {
      const response = await userDashboardService.rateTherapist(therapist.id, rating);
      const result = response.data.data;
      if (!result) return;
      setUserRating(result.userRating);
      onRatingSaved?.(therapist.id, {
        averageRating: result.averageRating,
        totalRatings: result.totalRatings,
      });
      toast.success("Rating saved");
    } finally {
      setSavingRating(false);
    }
  };

  return {
    canReview,
    userRating,
    hoverRating,
    setHoverRating,
    reviewLoading,
    savingRating,
    getMediaUrl,
    handleRating,
  };
};