import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/common/Button";

import {
  ArrowRight,
  BrainCircuit,
  Sparkles,
  Video,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Wallet,
  Star
} from "lucide-react";
import { useThemeStore } from "../../../store/use-theme-store";
import { useEffect } from "react";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--fg-primary)] transition-colors duration-300 font-body">

      {/* ─── NAVIGATION ────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[var(--bg-overlay)] border-b border-[var(--border-subtle)] transition-all duration-300">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-light)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-[var(--fg-primary)]">
            Renove
          </span>
        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate('/user/login')}
            className="hidden md:block text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] font-medium text-sm transition-colors"
          >
            Login
          </button>
          <Button
            variant="primary"
            className="!py-2 !px-4 !text-sm !rounded-full glow-brand"
            onClick={() => navigate('/user/register')}
          >
            Start Journey
          </Button>
        </div>
      </nav>

      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-[var(--accent-glow)] rounded-full blur-[100px] opacity-60 pointer-events-none ai-orb-pulse" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center stagger-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-glass)] backdrop-blur-md mb-8 text-sm font-medium text-[var(--accent-primary)] border-glow-animate">
            <Sparkles size={16} />
            <span>AI-Generated Recovery Journeys</span>
          </div>

          <h1 className="cinematic-headline mb-6 text-glow">
            Your Recovery, <br className="hidden md:block" />
            <span className="gradient-text">Built Around What You Love.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--fg-secondary)] max-w-3xl mb-10 leading-relaxed font-light stagger-2">
            Stop following generic advice. Our intelligent AI dynamically generates real-time, evidence-based recovery quests tailored exactly to your personal hobbies and needs, bridging the gap between digital gamification and professional therapy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto stagger-3">
            <Button
              variant="primary"
              className="!text-lg !px-8 !py-4 w-full sm:w-auto glow-brand group"
              onClick={() => navigate('/user/register')}
            >
              Begin Your Quest
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="!text-lg !px-8 !py-4 w-full sm:w-auto"
              onClick={() => navigate('/therapist')}
            >
              Join as a Therapist
            </Button>
          </div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-[var(--accent-light)] particle-float" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-[var(--accent-secondary)] particle-float" />
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-[var(--accent-primary)] particle-float" />
      </section>

      {/* ─── GAMIFIED JOURNEY (RAG PIPELINE) ───────────────── */}
      <section className="py-24 px-6 relative overflow-hidden bg-[var(--bg-subtle)] border-y border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6 z-10">
            <div className="rank-badge mb-2">Hyper-Personalized AI</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              A Gamified Journey <br /><span className="gradient-text">Unique to You</span>
            </h2>
            <p className="text-[var(--fg-secondary)] text-lg leading-relaxed">
              Renove doesn't use generic advice. Our intelligent system constantly researches the latest evidence-based recovery strategies and seamlessly blends them with your personal hobbies to create custom "Levels" and daily quests just for you.
            </p>
            <p className="text-[var(--fg-secondary)] text-lg leading-relaxed">
              Earn XP for logging moods, reflecting in your journal, and completing therapy sessions. Level up from a beginner to a master of your own mind.
            </p>
          </div>

          <div className="flex-1 relative w-full max-w-md lg:max-w-none">
            <div className="glass-card p-6 md:p-8 rounded-[2rem] relative z-10 glow-brand">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-mono text-[var(--fg-muted)] uppercase tracking-wider mb-1">Current Rank</p>
                  <h4 className="text-xl font-bold font-display">Mindful Voyager</h4>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-[var(--fg-muted)] uppercase tracking-wider mb-1">Level 12</p>
                  <p className="text-sm font-bold text-[var(--accent-primary)]">2,450 / 3,000 XP</p>
                </div>
              </div>

              <div className="h-3 w-full bg-[var(--bg-input)] rounded-full overflow-hidden mb-10">
                <div className="h-full w-[80%] xp-bar-fill" />
              </div>

              <div className="space-y-4">
                <div className="quest-card done">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-secondary)] flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Daily Journal Reflection</p>
                  </div>
                  <span className="text-xs font-mono text-[var(--fg-muted)]">+50 XP</span>
                </div>

                <div className="quest-card">
                  <div className="w-6 h-6 rounded-full border-2 border-[var(--border-strong)] shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Complete Therapist Session</p>
                  </div>
                  <span className="text-xs font-mono text-[var(--accent-primary)] font-bold">+200 XP</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent-glow)] rounded-full blur-3xl mix-blend-screen" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--accent-glow-secondary)] rounded-full blur-3xl mix-blend-screen" />
          </div>
        </div>
      </section>

      {/* ─── FULL FEATURE GRID ─────────────────────────────── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">A Complete Healing Ecosystem</h2>
            <p className="text-[var(--fg-secondary)] max-w-2xl mx-auto text-lg">
              Everything you need for recovery, perfectly integrated into one secure platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Nova AI Companion */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BrainCircuit size={28} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Meet Nova (AI)</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Your 24/7 empathetic listener. Nova provides a judgment-free space to reflect on your moods and seamlessly bridges the gap between your real therapy sessions.
              </p>
            </div>

            {/* Video Booking & Therapy */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Video size={28} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Video Sessions</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Browse verified therapist profiles, check their real-time availability, and book high-quality, encrypted WebRTC video sessions directly inside the platform.
              </p>
            </div>

            {/* Therapist Chat */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare size={28} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Direct Therapist Chat</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Recovery doesn't pause between appointments. Keep in touch with your licensed therapist through our secure, real-time messaging system.
              </p>
            </div>

            {/* Journal & Goals */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={28} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Journals & Goals</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Maintain a private digital journal to process your thoughts and set actionable daily goals. Your data is protected by strict platform security.
              </p>
            </div>

            {/* Wallet & Payments */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Wallet size={28} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Integrated Wallet</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Seamless, frictionless payments. Manage your session balances and transaction history in one unified dashboard, powered securely by Stripe.
              </p>
            </div>

            {/* Trusted Reviews */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star size={28} className="text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Reviews</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Trust is paramount. Only users who have completed actual sessions can rate and review their therapists, ensuring genuine community feedback.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ───────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden bg-[var(--bg-base)]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="cinematic-headline mb-6 text-glow">Ready to take the first step?</h2>
          <p className="text-[var(--fg-secondary)] text-lg mb-10 max-w-2xl mx-auto">
            Join Renove today and discover a sanctuary designed for your mental well-being. Whether you're seeking a verified therapist, a personal journal, or dynamic AI quests - your journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              variant="primary"
              className="!text-lg !px-10 !py-4 glow-brand"
              onClick={() => navigate('/user/register')}
            >
              Create Free Account
            </Button>
            <p className="text-sm text-[var(--fg-muted)] sm:hidden mt-2">or</p>
            <Button
              variant="outline"
              className="!text-lg !px-10 !py-4"
              onClick={() => navigate('/user/login')}
            >
              Log In
            </Button>
          </div>
        </div>

        <div className="absolute inset-0 scan-line pointer-events-none opacity-50" />
      </section>

      {/* ─── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-light)] flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Renove</span>
          </div>

          <div className="flex gap-6 text-sm text-[var(--fg-muted)]">
            <span className="hover:text-[var(--fg-primary)] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[var(--fg-primary)] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[var(--fg-primary)] cursor-pointer transition-colors">Contact Support</span>
          </div>

          <p className="text-sm text-[var(--fg-muted)]">
            &copy; {new Date().getFullYear()} Renove. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
