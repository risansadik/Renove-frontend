import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Loader2, X } from "lucide-react";
import type { GenerateLevelsPayload } from "../../../services/api/level.service.ts";

const ADDICTION_OPTIONS = [
  "Gaming", "Social Media", "Alcohol", "Smoking",
  "Substances", "Gambling", "Shopping", "Work",
  "Food", "Pornography", "Other",
];

const SEVERITY_OPTIONS = [
  {
    value: "mild" as const,
    label: "Mild",
    desc: "Occasional urges, mostly in control",
  },
  {
    value: "moderate" as const,
    label: "Moderate",
    desc: "Regular patterns affecting daily life",
  },
  {
    value: "severe" as const,
    label: "Severe",
    desc: "Significant impact on relationships and responsibilities",
  },
];

const INTEREST_SUGGESTIONS = [
  "Football", "Music", "Reading", "Gym", "Cooking",
  "Gaming", "Art", "Cycling", "Meditation", "Travel",
  "Photography", "Dancing", "Writing", "Yoga", "Nature",
];

const STEPS = ["What to overcome", "How intense", "What you love", "Ready to begin"];

interface Props {
  onComplete: (payload: GenerateLevelsPayload) => void;
  onClose: () => void;
  generating: boolean;
}

export const LevelOnboarding = ({ onComplete, onClose, generating }: Props) => {
  const [step, setStep] = useState(0);
  const [addictionType, setAddictionType] = useState("");
  const [customAddiction, setCustomAddiction] = useState("");
  const [severity, setSeverity] = useState<"mild" | "moderate" | "severe" | "">("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");

  const effectiveAddiction =
    addictionType === "Other" ? customAddiction.trim() : addictionType;

  const canNext =
    (step === 0 && effectiveAddiction.length >= 2) ||
    (step === 1 && severity !== "") ||
    (step === 2 && interests.length >= 1) ||
    step === 3;

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 10
        ? [...prev, interest]
        : prev
    );
  };

  const addCustomInterest = () => {
    const val = customInterest.trim();
    if (val && !interests.includes(val) && interests.length < 10) {
      setInterests((prev) => [...prev, val]);
      setCustomInterest("");
    }
  };

  const handleSubmit = () => {
    onComplete({
      addictionType: effectiveAddiction,
      severity: severity as "mild" | "moderate" | "severe",
      interests,
      regenerate: true,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "var(--bg-overlay)", backdropFilter: "blur(20px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="glass-card rounded-3xl w-full max-w-lg relative"
        style={{ padding: "2rem" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl transition-all"
          style={{ color: "var(--fg-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--bg-card-hover)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-strong)",
              color: "var(--accent-primary)",
            }}
          >
            <Sparkles size={10} />
            Step {step + 1} of 4 — {STEPS[step]}
          </div>

          {/* Progress bar */}
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: "var(--border-subtle)" }}
          >
            <motion.div
              animate={{ width: `${((step + 1) / 4) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "var(--accent-primary)" }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step 0: Addiction type */}
            {step === 0 && (
              <div>
                <h2
                  className="text-2xl mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--fg-primary)",
                  }}
                >
                  What are you overcoming?
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
                  Your journey is built around this. Be honest - there's no judgment here.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {ADDICTION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAddictionType(opt)}
                      className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background:
                          addictionType === opt
                            ? "var(--accent-primary)"
                            : "var(--bg-card)",
                        color:
                          addictionType === opt
                            ? "var(--fg-on-primary)"
                            : "var(--fg-secondary)",
                        border: `1px solid ${
                          addictionType === opt
                            ? "var(--accent-primary)"
                            : "var(--border-default)"
                        }`,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {addictionType === "Other" && (
                  <motion.input
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="input-field mt-2"
                    placeholder="Describe what you're overcoming…"
                    value={customAddiction}
                    onChange={(e) => setCustomAddiction(e.target.value)}
                  />
                )}
              </div>
            )}

            {/* Step 1: Severity */}
            {step === 1 && (
              <div>
                <h2
                  className="text-2xl mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--fg-primary)",
                  }}
                >
                  How intense is it?
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
                  This shapes the difficulty curve of your progression path.
                </p>
                <div className="flex flex-col gap-3">
                  {SEVERITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSeverity(opt.value)}
                      className="text-left p-4 rounded-2xl transition-all"
                      style={{
                        background:
                          severity === opt.value
                            ? "var(--bg-card-hover)"
                            : "var(--bg-card)",
                        border: `1px solid ${
                          severity === opt.value
                            ? "var(--accent-primary)"
                            : "var(--border-default)"
                        }`,
                        boxShadow:
                          severity === opt.value
                            ? "0 0 0 3px var(--accent-glow)"
                            : "none",
                      }}
                    >
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "var(--fg-primary)" }}
                      >
                        {opt.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <div>
                <h2
                  className="text-2xl mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--fg-primary)",
                  }}
                >
                  What do you love?
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
                  Your quests will be woven around these. Pick up to 10.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {INTEREST_SUGGESTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleInterest(opt)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background: interests.includes(opt)
                          ? "var(--accent-secondary)"
                          : "var(--bg-card)",
                        color: interests.includes(opt)
                          ? "#ffffff"
                          : "var(--fg-secondary)",
                        border: `1px solid ${
                          interests.includes(opt)
                            ? "var(--accent-secondary)"
                            : "var(--border-default)"
                        }`,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input
                    className="input-field"
                    placeholder="Add your own interest…"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomInterest()}
                  />
                  <button
                    onClick={addCustomInterest}
                    className="px-4 py-2 rounded-xl text-sm font-medium shrink-0 transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-strong)",
                      color: "var(--accent-primary)",
                    }}
                  >
                    Add
                  </button>
                </div>
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {interests.map((i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: "var(--accent-glow)",
                          color: "var(--accent-primary)",
                          border: "1px solid var(--border-accent)",
                        }}
                      >
                        {i}
                        <button
                          onClick={() => toggleInterest(i)}
                          style={{ color: "var(--accent-primary)" }}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, var(--accent-glow), transparent 70%)",
                    border: "1px solid var(--border-accent)",
                  }}
                >
                  <Sparkles size={28} style={{ color: "var(--accent-primary)" }} />
                </motion.div>
                <h2
                  className="text-2xl mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--fg-primary)",
                  }}
                >
                  Your world is ready to be forged.
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
                  The AI will now build the first 5 levels of your journey.
                  This takes a few seconds.
                </p>
                <div
                  className="rounded-2xl p-4 text-left space-y-2 mb-2"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <SummaryRow label="Overcoming" value={effectiveAddiction} />
                  <SummaryRow label="Intensity" value={severity} />
                  <SummaryRow label="Interests" value={interests.join(", ")} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={generating}
              className="btn-outline flex-shrink-0"
              style={{ width: "auto", paddingLeft: "1.25rem", paddingRight: "1.25rem" }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="btn-primary"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={generating}
              className="btn-primary"
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Forging your journey…
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Forge My Journey
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2 text-sm">
    <span
      className="font-mono text-xs pt-0.5 min-w-[80px]"
      style={{ color: "var(--fg-muted)" }}
    >
      {label}
    </span>
    <span className="font-medium capitalize" style={{ color: "var(--fg-primary)" }}>
      {value}
    </span>
  </div>
);