import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Star, Heart, Briefcase, GraduationCap, Calendar } from "lucide-react";
import type { ApprovedTherapist } from "../../../services/api/auth.service.ts";

interface Props {
  therapist: ApprovedTherapist | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (id: string) => void;
}

export const TherapistDetailsModal = ({ therapist, isOpen, onClose, onBook }: Props) => {
  const getMediaUrl = (path: string | undefined) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${import.meta.env.VITE_API_BASE_URL}/${path}`;
  };

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
                  style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}>
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
                      { icon: Star, label: "4.9/5" },
                      { icon: Heart, label: "120+ Clients" },
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
