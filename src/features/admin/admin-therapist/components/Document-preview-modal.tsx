import { X } from "lucide-react";
import type { DocumentPreviewModalProps } from "../types/admin-therapist.types";

export const DocumentPreviewModal = ({ previewUrl, onClose }: DocumentPreviewModalProps) => {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-10">
            <div className="absolute inset-0 bg-brand-900/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl max-h-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-up flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-brand-500/10 bg-white shrink-0">
                    <h3 className="font-display font-bold text-brand-900">Document Preview</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-brand-500/5 hover:bg-brand-500/10 flex items-center justify-center text-brand-900/40 hover:text-brand-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto bg-brand-900/5 p-4 flex items-center justify-center min-h-0">
                    {previewUrl.type === "image" ? (
                        <img
                            src={previewUrl.url}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        />
                    ) : (
                        <iframe
                            src={previewUrl.url}
                            className="w-full h-full min-h-[70vh] rounded-lg bg-white"
                            title="PDF Preview"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};