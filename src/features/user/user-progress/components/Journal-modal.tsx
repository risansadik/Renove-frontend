import { motion } from "framer-motion";
import { X } from "lucide-react";
import { MOOD_OPTIONS, type JournalModalProps } from "../types/user-progress.types.ts";

export const JournalModal = ({
  selectedJournal,
  setSelectedJournal,
}: JournalModalProps) => {
  if (!selectedJournal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg rounded-2xl p-6 space-y-4 relative overflow-hidden"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
      >
        <button
          onClick={() => setSelectedJournal(null)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-700/20 text-slate-400 hover:text-slate-100"
        >
          <X size={16} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono" style={{ color: "var(--fg-muted)" }}>
            {new Date(selectedJournal.createdAt).toLocaleString()}
          </span>
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full" style={{
            color: MOOD_OPTIONS.find((o) => o.value === selectedJournal.mood)?.color,
            background: MOOD_OPTIONS.find((o) => o.value === selectedJournal.mood)?.bg
          }}>
            {selectedJournal.mood}
          </span>
        </div>
        <h3 className="text-lg font-bold" style={{ color: "var(--fg-primary)" }}>{selectedJournal.title}</h3>
        <div className="p-4 rounded-xl text-xs leading-relaxed max-h-75 overflow-y-auto" style={{ background: "var(--bg-base)", color: "var(--fg-secondary)" }}>
          <p className="whitespace-pre-wrap">{selectedJournal.content}</p>
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setSelectedJournal(null)}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: "var(--accent-glow)", color: "var(--accent-primary)" }}
          >
            Close Entry
          </button>
        </div>
      </motion.div>
    </div>
  );
};