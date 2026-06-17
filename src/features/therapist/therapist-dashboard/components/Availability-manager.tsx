import { Calendar, Plus, X } from "lucide-react";
import { Button } from "../../../../components/common/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ConfirmationModal } from "../../../../components/common/Confirmation-modal";
import { useAvailabilityManager } from "../hooks/use-availability-manager";
import { AvailabilityRuleCard } from "./Availability-rule-card";
import { AvailabilityModalForm } from "./Availability-modal-form";


export const AvailabilityManager = () => {
  const {
    rules, loading, isModalOpen, setIsModalOpen, title, setTitle, startTime,
    setStartTime, endTime, setEndTime, selectedDays, isSubmitting, deleteId,
    setDeleteId, toggleDay, handleSubmit, handleDelete,
  } = useAvailabilityManager();

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
            <AvailabilityRuleCard key={rule.id} rule={rule} onDeleteClick={setDeleteId} />
          ))
        )}
      </div>

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

              <AvailabilityModalForm
                title={title} setTitle={setTitle} startTime={startTime} setStartTime={setStartTime}
                endTime={endTime} setEndTime={setEndTime} selectedDays={selectedDays} toggleDay={toggleDay}
                onSubmit={handleSubmit} onCancel={() => setIsModalOpen(false)} isSubmitting={isSubmitting}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};