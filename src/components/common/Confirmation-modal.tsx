import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmationModal = ({
  isOpen, onClose, onConfirm, title, description,
  confirmText = "Confirm", cancelText = "Cancel", isDestructive = false,
}: ConfirmationModalProps) => (
  <AnimatePresence>
    {isOpen && (
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
              {isDestructive && (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <AlertTriangle size={18} className="text-red-500" />
                </div>
              )}
              <h3 className="text-xl font-display font-bold" style={{ color: "var(--fg-primary)" }}>{title}</h3>
            </div>
            <button onClick={onClose} className="transition-colors"
              style={{ color: "var(--fg-muted)" }}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-sm leading-relaxed" style={{ color: "var(--fg-secondary)" }}>{description}</p>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-subtle)" }}>
            <button onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
              style={{ color: "var(--fg-muted)", background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              {cancelText}
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className="px-4 py-2 text-sm font-semibold rounded-xl transition-all text-white"
              style={isDestructive
                ? { background: "#ef4444", boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }
                : { background: "var(--accent-primary)", boxShadow: "0 4px 12px var(--accent-glow)" }
              }>
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
