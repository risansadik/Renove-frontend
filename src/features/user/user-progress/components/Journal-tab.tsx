import { motion } from "framer-motion";
import { BookOpen, Plus, Search, Trash2 } from "lucide-react";
import { MOOD_OPTIONS, type JournalTabProps } from "../types/user-progress.types";

export const JournalTab = ({
  handleCreateJournal,
  newJournalTitle,
  setNewJournalTitle,
  newJournalContent,
  setNewJournalContent,
  newJournalMood,
  setNewJournalMood,
  journalSearch,
  setJournalSearch,
  filteredJournals,
  setSelectedJournal,
  handleDeleteJournal,
}: JournalTabProps) => {
  return (
    <motion.div
      key="journal"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="grid lg:grid-cols-3 gap-6"
    >
      {/* Create Journal Form */}
      <div className="lg:col-span-1 p-6 rounded-2xl space-y-4 h-fit" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
        <h3 className="font-bold text-md flex items-center gap-2" style={{ color: "var(--fg-primary)" }}>
          <BookOpen size={16} className="text-purple-400" />
          <span>Write Journal Entry</span>
        </h3>
        <form onSubmit={handleCreateJournal} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Entry Title</label>
            <input
              type="text"
              value={newJournalTitle}
              onChange={(e) => setNewJournalTitle(e.target.value)}
              placeholder="How was today?"
              className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
              style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Content</label>
            <textarea
              rows={6}
              value={newJournalContent}
              onChange={(e) => setNewJournalContent(e.target.value)}
              placeholder="Share your raw feelings or recovery notes here…"
              className="w-full px-3 py-2.5 rounded-xl text-xs outline-none resize-none"
              style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Associated Mood</label>
            <div className="flex gap-1">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setNewJournalMood(opt.value)}
                  className="p-2.5 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: newJournalMood === opt.value ? opt.bg : "var(--bg-base)",
                    border: `1px solid ${newJournalMood === opt.value ? opt.color : "var(--border-default)"}`,
                  }}
                >
                  <opt.icon size={18} style={{ color: newJournalMood === opt.value ? opt.color : "var(--fg-muted)" }} />
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
            style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}
          >
            <Plus size={14} /> Save Entry
          </button>
        </form>
      </div>

      {/* Journals List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-muted)" }} />
          <input
            type="text"
            placeholder="Search journals…"
            value={journalSearch}
            onChange={(e) => setJournalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none"
            style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
          />
        </div>

        {filteredJournals.length === 0 ? (
          <div className="py-20 rounded-2xl text-center space-y-3" style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}>
            <BookOpen size={24} style={{ color: "var(--fg-muted)" }} className="mx-auto" />
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>No journal entries found. Share your thoughts!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredJournals.map((item) => {
              const opt = MOOD_OPTIONS.find((o) => o.value === item.mood) || MOOD_OPTIONS[0];
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedJournal(item)}
                  className="p-5 rounded-2xl cursor-pointer hover:border-purple-400 transition-all flex flex-col justify-between space-y-4 relative group"
                  style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px]" style={{ color: "var(--fg-muted)" }}>
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                      <span className="p-1 rounded-lg" style={{ background: opt.bg }}>
                        <opt.icon size={13} style={{ color: opt.color }} />
                      </span>
                    </div>
                    <h4 className="font-bold text-sm truncate" style={{ color: "var(--fg-primary)" }}>{item.title}</h4>
                    <p className="text-xs line-clamp-3 leading-relaxed" style={{ color: "var(--fg-muted)" }}>{item.content}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                    <span className="text-[10px] font-medium text-purple-400 group-hover:underline">Read Entry →</span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteJournal(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};