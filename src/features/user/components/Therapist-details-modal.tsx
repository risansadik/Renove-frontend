import { X, Users, Star, Clock, Heart, Briefcase, GraduationCap } from "lucide-react";
import type { ApprovedTherapist } from "../../../services/api/auth.service.js";

interface TherapistDetailsModalProps {
  therapist: ApprovedTherapist | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (id: string) => void;
}

export const TherapistDetailsModal = ({
  therapist,
  isOpen,
  onClose,
  onBook,
}: TherapistDetailsModalProps) => {
  if (!isOpen || !therapist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-fadeUp">
        {/* Header Profile Area */}
        <div className="bg-brand-500/5 px-6 py-8 border-b border-brand-900/10 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-brand-900/10 text-brand-900/50 hover:text-brand-900 hover:bg-brand-50 transition-colors"
          >
            <X size={16} />
          </button>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-display font-bold text-brand-600 bg-brand-100 border-4 border-surface shadow-md shrink-0">
              {therapist.avatar}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h2 className="text-2xl font-display font-bold text-brand-900">{therapist.name}</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sage-500/15 text-sage-700 border border-sage-500/20 w-fit mx-auto sm:mx-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse" />
                  Available
                </span>
              </div>
              <p className="text-brand-900/70 mb-4">{therapist.specialization.join(" • ")}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-xl border border-brand-900/10 shadow-sm text-sm">
                  <Briefcase size={14} className="text-brand-500" />
                  <span className="text-brand-900/80 font-medium">{therapist.experience}y Exp.</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-xl border border-brand-900/10 shadow-sm text-sm">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-brand-900/80 font-medium">4.9/5</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface rounded-xl border border-brand-900/10 shadow-sm text-sm">
                  <Heart size={14} className="text-rose-500" />
                  <span className="text-brand-900/80 font-medium">120+ Clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          <div>
            <h3 className="text-lg font-semibold text-brand-900 mb-3 flex items-center gap-2">
              <GraduationCap size={18} className="text-brand-500" />
              About Me
            </h3>
            <p className="text-brand-900/70 leading-relaxed text-sm whitespace-pre-wrap">
              {therapist.bio}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-brand-900 mb-3 flex items-center gap-2">
              <Users size={18} className="text-brand-500" />
              Focus Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {therapist.specialization.map((spec) => (
                <span
                  key={spec}
                  className="px-3 py-1.5 bg-brand-500/5 border border-brand-500/20 text-brand-700 rounded-lg text-sm font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-surface-50 border-t border-brand-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-center sm:text-left">
            <p className="text-xs text-brand-900/50 uppercase tracking-wider font-semibold mb-1">Consultation Fee</p>
            <p className="text-2xl font-display font-bold text-brand-900">₹{therapist.consultationFee}<span className="text-base font-normal text-brand-900/50">/session</span></p>
          </div>
          <button
            onClick={() => onBook(therapist.id)}
            className="w-full sm:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Clock size={18} />
            Book Session Now
          </button>
        </div>
      </div>
    </div>
  );
};
