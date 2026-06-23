import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Star, Briefcase, GraduationCap, Calendar, Loader2, MessageSquare } from "lucide-react";
import { useTherapistDetails } from "../hooks/use-therapist-details";
import type { TherapistDatailsProps } from "../types/user-dashboard.types";
import type { PublicReviewItem } from "../../../../services/api/auth.service";


export const TherapistDetailsModal = ({ therapist, isOpen, onClose, onBook, onRatingSaved }: TherapistDatailsProps) => {
  const {
    canReview,
    userRating,
    userComment,
    comment,
    setComment,
    hoverRating,
    setHoverRating,
    reviewLoading,
    savingRating,
    getMediaUrl,
    handleRating,
    reviews,
    reviewsLoading,
  } = useTherapistDetails({ therapist, isOpen, onRatingSaved });

  const ratingLabel = ((therapist?.averageRating ?? 0) > 0)
    ? `${therapist?.averageRating?.toFixed(1)}/5`
    : "New";

  return (
    <AnimatePresence>
      {isOpen && therapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md"
            style={{ background: "var(--bg-overlay)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}
          >
            {/* Header */}
            <div className="relative px-8 py-8 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--accent-glow)" }}>
              <button onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--fg-muted)" }}>
                <X size={15} />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-display font-bold text-white shrink-0 overflow-hidden"
                  style={{ background: "gradient-linear(135deg, var(--accent-primary), var(--accent-secondary))" }}>
                  {therapist.profileImage ? (
                    <img src={getMediaUrl(therapist.profileImage)} alt={therapist.name} className="w-full h-full object-cover" />
                  ) : (
                    therapist.avatar
                  )}
                </div>

                <div className="text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h2 className="font-display text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>
                      {therapist.name}
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold w-fit mx-auto sm:mx-0"
                      style={{ background: "rgba(74,107,82,0.15)", color: "var(--accent-secondary)", border: "1px solid rgba(74,107,82,0.3)" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                      Available
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: "var(--fg-secondary)" }}>{therapist.specialization.join(" • ")}</p>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {[
                      { icon: Briefcase, label: `${therapist.experience}y Exp.` },
                      { icon: Star, label: ratingLabel },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--fg-secondary)" }}>
                        <Icon size={13} style={{ color: "var(--accent-primary)" }} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-7">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-base" style={{ color: "var(--fg-primary)" }}>
                  <GraduationCap size={17} style={{ color: "var(--accent-primary)" }} /> About Me
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--fg-secondary)" }}>{therapist.bio}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-base" style={{ color: "var(--fg-primary)" }}>
                  <Users size={17} style={{ color: "var(--accent-primary)" }} /> Focus Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {therapist.specialization.map((spec) => (
                    <span key={spec} className="px-3 py-1.5 rounded-xl text-xs font-medium"
                      style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)", color: "var(--accent-primary)" }}>
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-base" style={{ color: "var(--fg-primary)" }}>
                  <Star size={17} style={{ color: "var(--accent-primary)" }} /> Your Rating
                </h3>
                <div className="flex flex-col gap-3">
                  {/* Stars */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => {
                        const activeRating = hoverRating ?? userRating ?? 0;
                        return (
                          <button
                            key={rating}
                            type="button"
                            disabled={!canReview || reviewLoading || savingRating}
                            onClick={() => handleRating(rating)}
                            onMouseEnter={() => setHoverRating(rating)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                            style={{ color: rating <= activeRating ? "#f59e0b" : "var(--fg-muted)" }}
                            aria-label={`Rate ${rating} star${rating === 1 ? "" : "s"}`}
                          >
                            <Star size={22} fill={rating <= activeRating ? "currentColor" : "none"} />
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                      {reviewLoading
                        ? "Checking session history..."
                        : canReview
                          ? userRating
                            ? "You can update your review anytime."
                            : "Rate after your completed session."
                          : "Available after you attend a completed session."}
                    </p>
                  </div>

                  {canReview && !reviewLoading && (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={savingRating}
                        maxLength={500}
                        rows={3}
                        placeholder={userComment ? "Update your comment…" : "Leave an optional comment…"}
                        className="w-full resize-none rounded-xl px-4 py-3 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: "var(--bg-subtle)",
                          border: "1px solid var(--border-default)",
                          color: "var(--fg-primary)",
                          outline: "none",
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                          {comment.length}/500
                        </span>
                        <button
                          type="button"
                          disabled={savingRating || !userRating}
                          onClick={() => userRating && handleRating(userRating)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: "var(--accent-primary)",
                            color: "var(--fg-on-accent, #fff)",
                          }}
                        >
                          {savingRating ? "Saving…" : userComment ? "Update Comment" : "Save Comment"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-base" style={{ color: "var(--fg-primary)" }}>
                  <MessageSquare size={17} style={{ color: "var(--accent-primary)" }} />
                  Reviews
                  {reviews.length > 0 && (
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full"
                      style={{ background: "var(--bg-subtle)", color: "var(--fg-muted)", border: "1px solid var(--border-default)" }}>
                      {reviews.length}
                    </span>
                  )}
                </h3>

                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 size={18} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-sm py-4 text-center" style={{ color: "var(--fg-muted)" }}>
                    No reviews yet. Be the first to share your experience.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-subtle)" }}>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-0.5" style={{ color: "var(--fg-muted)" }}>Consultation Fee</p>
                <p className="font-display text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>
                  ${therapist.consultationFee}
                  <span className="text-base font-normal" style={{ color: "var(--fg-muted)" }}>/session</span>
                </p>
              </div>
              <button onClick={() => onBook(therapist.id)}
                className="btn-primary sm:w-auto px-8 py-3 rounded-xl h-12 flex items-center gap-2">
                <Calendar size={16} /> Book Session
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ReviewCard = ({ review }: { review: PublicReviewItem }) => (
  <div
    className="flex flex-col gap-2 rounded-2xl p-4"
    style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", border: "1px solid var(--border-accent)" }}
        >
          {review.userName[0].toUpperCase()}
        </div>
        <span className="text-sm font-semibold" style={{ color: "var(--fg-primary)" }}>
          {review.userName}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            fill={s <= review.rating ? "#f59e0b" : "none"}
            style={{ color: s <= review.rating ? "#f59e0b" : "var(--fg-muted)" }}
          />
        ))}
      </div>
    </div>
    {review.comment && (
      <p className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
        {review.comment}
      </p>
    )}
    <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
      {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
    </p>
  </div>
);