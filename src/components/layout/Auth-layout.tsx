import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "../common/ThemeToggle.js";
import { Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  panel?: ReactNode;
}

export const AuthLayout = ({ children, panel }: AuthLayoutProps) => (
  <div className="min-h-screen flex" style={{ background: "var(--bg-base)" }}>
    {/* Left cinematic panel */}
    <aside className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
      style={{ background: "linear-gradient(145deg, #1a0a22 0%, #2d1040 40%, #3d1f4a 70%, #1a2a1a 100%)" }}>

      {/* Ambient orbs */}
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(107,76,122,0.5), transparent 70%)", filter: "blur(50px)" }} />
      <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,107,82,0.4), transparent 70%)", filter: "blur(60px)" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6b4c7a, #b89bbe)" }}>
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-xl text-white tracking-tight">reNove</span>

      </motion.div>

      {/* Panel content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10 flex-1 flex flex-col justify-center">
        {panel ?? <DefaultPanel />}
      </motion.div>

      <div className="relative z-10 text-white/25 text-xs font-mono">© 2026 reNove. Recovery reimagined.</div>
    </aside>

    {/* Right form area */}
    <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto relative"
      style={{ background: "var(--bg-base)" }}>
      <div className="absolute top-6 right-6 z-20"><ThemeToggle /></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6b4c7a, #b89bbe)" }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: "var(--fg-primary)" }}>reNove</span>
        </div>
        {children}
      </motion.div>
    </main>
  </div>
);

const DefaultPanel = () => (
  <div>
    <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: "rgba(196,168,208,0.7)" }}>
      Recovery reimagined
    </p>
    <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
      Your journey to freedom{" "}
      <span style={{ color: "#b89bbe" }}>starts here.</span>
    </h2>
    <p className="text-white/60 text-base leading-relaxed mb-10">
      An AI-powered platform that transforms recovery into a guided progression journey - with therapist support, gamified milestones, and real-time emotional intelligence.
    </p>
    <div className="flex flex-col gap-4">
      {[
        { n: "30", label: "Adaptive recovery levels" },
        { n: "AI", label: "Emotional companion, always online" },
        { n: "24/7", label: "Expert therapist access" },
      ].map(({ n, label }) => (
        <div key={n} className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(107,76,122,0.25)", border: "1px solid rgba(107,76,122,0.4)" }}>
            <span className="text-white font-display font-bold text-sm">{n}</span>
          </div>
          <span className="text-white/70 text-sm">{label}</span>
        </div>
      ))}
    </div>
  </div>
);
