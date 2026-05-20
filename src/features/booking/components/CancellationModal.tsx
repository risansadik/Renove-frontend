import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, RefreshCw, DollarSign, Clock } from "lucide-react";
import type { BookingResponse } from "../../../services/api/booking.service";

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  booking: BookingResponse | null;
}

const CANCELLATION_REASONS = [
  "Schedule conflict",
  "Feeling better",
  "Booked by mistake",
  "Financial issues",
  "Emergency",
  "Other"
];

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  booking
}) => {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  const getRefundDetails = () => {
    if (!booking) return null;
    
    const fee = typeof booking.therapistId === "object" && booking.therapistId !== null ? (booking.therapistId as { id: string; name: string; consultationFee: number }).consultationFee || 0 : 0;
    
    if (booking.status === "awaiting_payment" || booking.status === "pending") {
      return { percent: 100, amount: 0, hoursRemaining: 999, freeRelease: true };
    }

    if (!booking.slotId || typeof booking.slotId !== "object" || !booking.slotId.startTime) {
      return { percent: 0, amount: 0, hoursRemaining: 0, freeRelease: false };
    }

    const now = new Date();
    const startTime = new Date(booking.slotId.startTime);
    const diffMs = startTime.getTime() - now.getTime();
    const hoursRemaining = diffMs / (1000 * 60 * 60);

    let percent = 0;
    if (hoursRemaining > 24) {
      percent = 100;
    } else if (hoursRemaining >= 6) {
      percent = 50;
    } else {
      percent = 0;
    }

    return {
      percent,
      amount: (fee * percent) / 100,
      hoursRemaining,
      freeRelease: false
    };
  };

  const refundDetails = getRefundDetails();

  const handleConfirm = () => {
    const finalReason = selectedReason === "Other" ? customReason || "Other" : selectedReason;
    onConfirm(finalReason);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md"
            style={{ background: "var(--bg-overlay)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <AlertTriangle size={18} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold" style={{ color: "var(--fg-primary)" }}>Cancel Session</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Please review the cancellation policy below.</p>
                </div>
              </div>
              <button onClick={onClose} className="transition-colors"
                style={{ color: "var(--fg-muted)" }}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Refund Summary Card */}
              {refundDetails && (
                <div className="p-5 rounded-2xl space-y-4" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)" }}>
                  <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
                    <RefreshCw size={16} className="animate-spin-slow text-purple-500" />
                    Refund Eligibility
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--fg-muted)" }}>
                        <Clock size={12} /> Hours Remaining
                      </span>
                      <span className="text-sm font-medium" style={{ color: "var(--fg-primary)" }}>
                        {refundDetails.hoursRemaining === 999 
                          ? "N/A (Unpaid session)" 
                          : refundDetails.hoursRemaining < 0 
                            ? "Session started" 
                            : `${refundDetails.hoursRemaining.toFixed(1)} hrs`}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--fg-muted)" }}>
                        <DollarSign size={12} /> Refund Eligible
                      </span>
                      <span className="text-sm font-bold" style={{ color: "var(--fg-primary)" }}>
                        {refundDetails.freeRelease 
                          ? "100% Free (No charge)" 
                          : `${refundDetails.percent}% Refund ($${refundDetails.amount.toFixed(2)})`}
                      </span>
                    </div>
                  </div>

                  {/* Warning Note */}
                  {!refundDetails.freeRelease && (
                    <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
                      {refundDetails.percent === 100 && "Cancellation is 24+ hours in advance. Full refund will be credited instantly to your wallet."}
                      {refundDetails.percent === 50 && "Cancellation is 6-24 hours in advance. Partial (50%) refund applies and will be credited instantly."}
                      {refundDetails.percent === 0 && "Cancellation is less than 6 hours in advance. No refund is available for this slot."}
                    </div>
                  )}
                </div>
              )}

              {/* Cancellation Reason Inputs */}
              <div className="space-y-3">
                <label className="block text-sm font-medium" style={{ color: "var(--fg-secondary)" }}>
                  Reason for Cancellation
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  {CANCELLATION_REASONS.map((reason) => (
                    <option key={reason} value={reason} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                      {reason}
                    </option>
                  ))}
                </select>

                {selectedReason === "Other" && (
                  <textarea
                    placeholder="Please write your reason here..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    rows={3}
                    className="input-field mt-2 resize-none text-sm"
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-subtle)" }}>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
                style={{ color: "var(--fg-muted)", background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-semibold rounded-xl transition-all text-white"
                style={{ background: "#ef4444", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }}
              >
                Confirm Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
