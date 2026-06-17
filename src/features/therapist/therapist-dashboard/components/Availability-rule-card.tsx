import { Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { DAYS, type AvailabilityRuleCardProps } from "../types/therapist-dashboard.types";

export const AvailabilityRuleCard = ({ rule, onDeleteClick }: AvailabilityRuleCardProps) => (
  <motion.div
    layout
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
        onClick={() => onDeleteClick(rule.id)}
        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
        title="Delete Rule"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </motion.div>
);