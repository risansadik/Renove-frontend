import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userDashboardService, type PublicReviewItem } from "../../../../services/api/auth.service.ts";
import type { UseTherapistDetailsProps } from "../types/user-dashboard.types.ts";

export const useTherapistDetails = ({ therapist, isOpen, onRatingSaved }: UseTherapistDetailsProps) => {
  const [canReview, setCanReview] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userComment, setUserComment] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [savingRating, setSavingRating] = useState(false);
  const [reviews, setReviews] = useState<PublicReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const getMediaUrl = (path: string | undefined) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${import.meta.env.VITE_API_BASE_URL}/${path}`;
  };

  useEffect(() => {
    if (!isOpen || !therapist?.id) return;

    let active = true;

    setReviewLoading(true);
    setReviewsLoading(true);

    userDashboardService
      .getTherapistReviewStatus(therapist.id)
      .then((response) => {
        if (!active) return;
        const status = response.data.data;
        setCanReview(status?.canReview ?? false);
        setUserRating(status?.userRating ?? null);
        setUserComment(status?.userComment ?? null);
        setComment(status?.userComment ?? "");
      })
      .finally(() => { if (active) setReviewLoading(false); });

    userDashboardService
      .getTherapistReviews(therapist.id)
      .then((response) => {
        if (!active) return;
        setReviews(response.data.data ?? []);
      })
      .finally(() => { if (active) setReviewsLoading(false); });

    return () => { active = false; };
  }, [isOpen, therapist?.id]);

  const refreshReviews = async (therapistId: string) => {
    const response = await userDashboardService.getTherapistReviews(therapistId);
    setReviews(response.data.data ?? []);
  };

  const handleRating = async (rating: number) => {
    if (!therapist || savingRating) return;

    setSavingRating(true);
    try {
      const trimmedComment = comment.trim() || undefined;
      const response = await userDashboardService.rateTherapist(therapist.id, rating, trimmedComment);
      const result = response.data.data;
      if (!result) return;
      setUserRating(result.userRating);
      setUserComment(result.userComment);
      onRatingSaved?.(therapist.id, {
        averageRating: result.averageRating,
        totalRatings: result.totalRatings,
      });
      await refreshReviews(therapist.id);
      toast.success("Review saved");
    } finally {
      setSavingRating(false);
    }
  };

  return {
    canReview,
    userRating,
    userComment,
    comment,
    setComment,
    hoverRating,
    setHoverRating,
    reviewLoading,
    savingRating,
    reviews,
    reviewsLoading,
    getMediaUrl,
    handleRating,
  };
};