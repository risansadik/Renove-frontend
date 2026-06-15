import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { AiCompanion } from "./components/AiCompanion.tsx";

export const AiCompanionPage = () => (
  <div
    className="min-h-full p-6 md:p-8"
    style={{ background: "var(--bg-base)" }}
  >
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
          }}
        >
          <Brain size={22} className="text-white" />
        </div>
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "var(--fg-primary)" }}
          >
            Nova
          </h1>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Your AI recovery companion - always here to listen.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AiCompanion />
      </motion.div>
    </div>
  </div>
);