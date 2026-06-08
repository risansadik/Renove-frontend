import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const QUOTES = [
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.", author: "Rikki Rogers" },
  { text: "The only way out is through.", author: "Robert Frost" },
  { text: "Fall seven times. Stand up eight.", author: "Japanese Proverb" },
  { text: "Your present circumstances don't determine where you go — they merely determine where you start.", author: "Nido Qubein" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "Rock bottom became the solid foundation on which I rebuilt my life.", author: "J.K. Rowling" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The comeback is always stronger than the setback.", author: "Unknown" },
];

const ORB_CONFIG = [
  { size: 320, top: "5%", left: "10%", delay: 0, duration: 7, purple: true },
  { size: 240, top: "55%", right: "8%", delay: 2, duration: 9, purple: false },
  { size: 180, top: "25%", left: "55%", delay: 1, duration: 6, purple: true },
];

export const ForgeLoadingScreen = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, 3500);
    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        return p + (Math.random() * 3 + 0.5);
      });
    }, 400);
    return () => clearInterval(progressInterval);
  }, []);

  const quote = QUOTES[quoteIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Ambient orbs */}
      {ORB_CONFIG.map((o, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.18, 1], opacity: [0.1, 0.22, 0.1] }}
          transition={{ duration: o.duration, repeat: Infinity, delay: o.delay }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: o.size,
            height: o.size,
            background: o.purple
              ? "radial-gradient(circle, rgba(107,76,122,0.5), transparent 70%)"
              : "radial-gradient(circle, rgba(74,107,82,0.4), transparent 70%)",
            filter: "blur(50px)",
            top: o.top,
            left: (o as any).left,
            right: (o as any).right,
          }}
        />
      ))}

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [-12, 12, -12], opacity: [0.15, 0.55, 0.15] }}
            transition={{
              duration: 4 + (i % 3) * 2,
              repeat: Infinity,
              delay: i * 0.35,
            }}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              background:
                i % 2 === 0 ? "var(--accent-primary)" : "var(--accent-secondary)",
              left: `${5 + i * 6}%`,
              top: `${10 + (i * 11) % 70}%`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 text-center">
        {/* Pulsing orb icon */}
        <motion.div
          animate={{
            scale: [1, 1.14, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
            border: "1px solid var(--border-accent)",
            boxShadow: "0 0 40px var(--accent-glow)",
          }}
        >
          <Sparkles size={32} style={{ color: "var(--accent-primary)" }} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl mb-2"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--fg-primary)",
            lineHeight: 1.1,
          }}
        >
          Forging your world…
        </motion.h2>
        <p className="text-sm mb-10" style={{ color: "var(--fg-muted)" }}>
          The AI is crafting 20 personalized levels around your life.
        </p>

        {/* Progress bar */}
        <div
          className="h-1.5 rounded-full overflow-hidden mb-10 mx-auto"
          style={{ background: "var(--border-subtle)", maxWidth: 340 }}
        >
          <motion.div
            animate={{ width: `${Math.min(progress, 92)}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--accent-primary), var(--accent-light))",
              boxShadow: "0 0 8px var(--accent-glow)",
            }}
          />
        </div>

        {/* Rotating quote */}
        <div className="min-h-[90px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45 }}
              className="text-center"
            >
              <p
                className="text-base font-medium leading-relaxed mb-2 max-w-sm mx-auto"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--fg-primary)",
                  fontStyle: "italic",
                }}
              >
                "{quote.text}"
              </p>
              <p
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: "var(--accent-primary)" }}
              >
                — {quote.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bouncing dots */}
        <div className="flex justify-center gap-2 mt-10">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent-primary)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};