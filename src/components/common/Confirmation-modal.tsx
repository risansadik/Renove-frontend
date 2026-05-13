import { X } from "lucide-react";

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
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-fadeUp">
        <div className="flex items-start justify-between p-6 border-b border-brand-900/10">
          <h3 className="text-xl font-display font-bold text-brand-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-brand-900/40 hover:text-brand-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-brand-900/70">{description}</p>
        </div>
        <div className="bg-surface-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-brand-900/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-brand-900/70 hover:text-brand-900 hover:bg-brand-900/5 rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              isDestructive
                ? "bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/20"
                : "bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
