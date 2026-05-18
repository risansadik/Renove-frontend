import { motion } from "framer-motion";
import { Brain, MessageCircle, Users, Star, Heart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { ApprovedTherapist } from "../../../services/api/auth.service.js";

const AI_PROMPTS = ["I feel triggered", "Motivate me", "I need help", "Distract me"];

interface Props {
  therapists: ApprovedTherapist[];
  onSelectTherapist: (t: ApprovedTherapist) => void;
}

export const SupportSection = ({ therapists, onSelectTherapist }: Props) => (
  <section className="py-24 px-4" style={{ background: "var(--bg-subtle)" }}>
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--fg-primary)" }}>
          Your Support System
        </h2>
        <p style={{ color: "var(--fg-secondary)" }}>AI intelligence and human expertise - both on your side.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* AI Companion */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 relative overflow-hidden spotlight-card"
        >
          {/* Glow orb */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, var(--accent-glow-secondary), transparent 70%)", filter: "blur(20px)" }} />

          <div className="relative z-10 flex items-start gap-5 mb-6">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}>
                <Brain size={28} className="text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 bg-green-500"
                style={{ borderColor: "var(--bg-card)" }} />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>Nova</h3>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--accent-secondary)" }}>
                AI Recovery Companion - Online
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-6 italic"
            style={{ color: "var(--fg-secondary)", borderLeft: "3px solid var(--accent-primary)", paddingLeft: "0.875rem" }}>
            "I've analyzed your emotional pattern today. Your momentum is building - let's keep that energy alive.
            What do you need right now?"
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {AI_PROMPTS.map((p) => (
              <button key={p}
                className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  color: "var(--fg-secondary)",
                }}>
                {p}
              </button>
            ))}
          </div>

          <button className="btn-primary rounded-xl h-12 w-full">
            <MessageCircle size={16} /> Talk to Nova
          </button>
        </motion.div>

        {/* Human Experts Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 relative overflow-hidden spotlight-card"
        >
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, var(--accent-glow), transparent 70%)", filter: "blur(20px)" }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Heart size={22} style={{ color: "var(--accent-primary)" }} />
              <h3 className="font-display text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>Human Experts</h3>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--fg-secondary)" }}>
              Certified recovery specialists available for personalized sessions.
            </p>
            <div className="space-y-3 mb-6">
              {(therapists.length > 0 ? therapists.slice(0, 3) : [
                { id: "1", name: "Dr. Sarah Collins", specialization: "Addiction Recovery", consultationFee: 80 } as any,
                { id: "2", name: "Dr. James Reid", specialization: "Trauma & PTSD", consultationFee: 90 } as any,
              ]).map((t: any, i) => (
                <motion.button
                  key={t._id ?? i}
                  whileHover={{ x: 4 }}
                  onClick={() => therapists.length > 0 && onSelectTherapist(t)}
                  className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-left transition-all"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}>
                    {(t.name ?? "T")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--fg-primary)" }}>{t.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--fg-muted)" }}>{t.specialization}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-500" fill="currentColor" />
                      <span className="text-xs font-bold" style={{ color: "var(--fg-primary)" }}>4.9</span>
                    </div>
                    <p className="text-[10px]" style={{ color: "var(--fg-muted)" }}>${t.consultationFee}/hr</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/dashboard/therapists" className="btn-primary rounded-xl h-12 flex items-center justify-center gap-2">
                <Calendar size={15} /> Book Session
              </Link>
              <Link to="/dashboard/therapists" className="btn-outline rounded-xl h-12 flex items-center justify-center gap-2" style={{ width: "100%" }}>
                <Users size={15} /> Browse All
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
