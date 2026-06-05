import { useState, useEffect, useCallback } from "react";
import { Calendar, Plus, Clock, Trash2, X } from "lucide-react";
import { Button } from "../../../components/common/Button";
import availabilityService, { type AvailabilityRule } from "../../../services/api/availability.service";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "../../../components/common/Confirmation-modal";

const DAYS = [
  { label: "Mon", value: "MO" },
  { label: "Tue", value: "TU" },
  { label: "Wed", value: "WE" },
  { label: "Thu", value: "TH" },
  { label: "Fri", value: "FR" },
  { label: "Sat", value: "SA" },
  { label: "Sun", value: "SU" },
];

export const AvailabilityManager = () => {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("Regular Session");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      const res = await availabilityService.getMyAvailabilityRules();
      setRules(res.data);
    }  finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRules();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchRules]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    setIsSubmitting(true);
    try {
      const rrule = `FREQ=WEEKLY;BYDAY=${selectedDays.join(",")}`;
      await availabilityService.createAvailability({
        title,
        startTime,
        endTime,
        recurrenceRule: rrule,
        recurrenceType: "weekly",
        startDate: new Date().toISOString(),
      });
      toast.success("Availability rule created successfully!");
      setIsModalOpen(false);
      fetchRules();
      // Reset form
      setSelectedDays([]);
      setStartTime("09:00");
      setEndTime("10:00");
    }finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    
      await availabilityService.deleteAvailability(id);
      toast.success("Rule deleted successfully");
      fetchRules();
    
  };

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Schedule?"
        description="Are you sure you want to delete this availability rule? All associated available slots will also be removed from your calendar."
        isDestructive
        confirmText="Delete"
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--fg-primary)" }}>Availability Management</h2>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Manage your recurring session schedules.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} /> Add Schedule
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "var(--accent-primary)" }}></div>
          </div>
        ) : rules.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border-dashed border-2 flex flex-col items-center gap-4"
               style={{ borderColor: "var(--border-subtle)" }}>
            <Calendar size={48} className="opacity-20" />
            <div className="max-w-xs">
              <h3 className="font-bold mb-1" style={{ color: "var(--fg-primary)" }}>No recurring rules</h3>
              <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Set up your weekly availability to allow users to book sessions with you.</p>
            </div>
          </div>
        ) : (
          rules.map((rule) => (
            <motion.div
              layout
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 rounded-2xl flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
                  <Clock size={20} style={{ color: "var(--accent-primary)" }} />
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: "var(--fg-primary)" }}>{rule.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" 
                          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--fg-secondary)" }}>
                      {rule.startTime} - {rule.endTime}
                    </span>
                    <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                      {rule.recurrenceRule.split("BYDAY=")[1].split(",").map(d => DAYS.find(day => day.value === d)?.label).join(", ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => setDeleteId(rule.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                  title="Delete Rule"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-4xl p-8 overflow-hidden spotlight-card shadow-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors">
                <X size={20} style={{ color: "var(--fg-muted)" }} />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--fg-primary)" }}>New Recurring Schedule</h3>
                <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Set your weekly available hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: "var(--fg-muted)" }}>Schedule Label</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl text-sm transition-all focus:ring-2"
                    style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
                    placeholder="e.g. Morning Sessions"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: "var(--fg-muted)" }}>Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl text-sm"
                      style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: "var(--fg-muted)" }}>End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl text-sm"
                      style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--fg-primary)" }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: "var(--fg-muted)" }}>Repeat on Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`h-11 px-4 rounded-xl text-xs font-bold transition-all ${
                          selectedDays.includes(day.value) ? "scale-105" : ""
                        }`}
                        style={{
                          background: selectedDays.includes(day.value) ? "var(--accent-primary)" : "var(--bg-base)",
                          border: `1px solid ${selectedDays.includes(day.value) ? "var(--accent-primary)" : "var(--border-default)"}`,
                          color: selectedDays.includes(day.value) ? "white" : "var(--fg-secondary)"
                        }}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 rounded-xl h-12" loading={isSubmitting}>
                    Create Rule
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
