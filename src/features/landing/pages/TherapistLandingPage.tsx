import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/common/Button";
import { 
  ArrowRight, 
  CalendarClock, 
  Wallet, 
  Video, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  BarChart
} from "lucide-react";

export const TherapistLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--fg-primary)] transition-colors duration-300 font-body">
      
      {/* ─── NAVIGATION ────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[var(--bg-overlay)] border-b border-[var(--border-subtle)] transition-all duration-300">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent-secondary)] to-[var(--accent-glow-secondary)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow-secondary)]">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-[var(--fg-primary)]">
            Renove <span className="text-[var(--accent-secondary)] font-normal">Providers</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/therapist/login')}
            className="hidden md:block text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] font-medium text-sm transition-colors"
          >
            Provider Login
          </button>
          <Button 
            variant="primary" 
            className="!py-2 !px-4 !text-sm !rounded-full"
            style={{ backgroundColor: 'var(--accent-secondary)', color: 'white' }}
            onClick={() => navigate('/therapist/register')}
          >
            Apply to Join
          </Button>
        </div>
      </nav>

      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-[var(--accent-glow-secondary)] rounded-full blur-[100px] opacity-60 pointer-events-none ai-orb-pulse" />
        
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center stagger-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--bg-glass)] backdrop-blur-md mb-8 text-sm font-medium text-[var(--accent-secondary)]">
            <ShieldCheck size={16} />
            <span>Empowering Mental Health Professionals</span>
          </div>
          
          <h1 className="cinematic-headline mb-6 text-glow">
            Focus on Healing. <br className="hidden md:block" />
            <span style={{ color: "var(--accent-secondary)" }}>We handle the rest.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[var(--fg-secondary)] max-w-3xl mb-10 leading-relaxed font-light stagger-2">
            Join a cutting-edge platform where AI companions handle daily check-ins, allowing you to focus purely on high-impact therapy. Manage your schedule, conduct secure video sessions, and track your earnings effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto stagger-3">
            <Button 
              variant="primary" 
              className="!text-lg !px-8 !py-4 w-full sm:w-auto group"
              style={{ backgroundColor: 'var(--accent-secondary)', color: 'white', boxShadow: '0 0 30px var(--accent-glow-secondary)' }}
              onClick={() => navigate('/therapist/register')}
            >
              Start Your Practice Here
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="!text-lg !px-8 !py-4 w-full sm:w-auto"
              style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
              onClick={() => navigate('/therapist/login')}
            >
              Provider Login
            </Button>
          </div>
        </div>
      </section>

      {/* ─── WHY JOIN US ───────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden bg-[var(--bg-subtle)] border-y border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 stagger-1">
            <h2 className="font-display text-4xl font-bold mb-4">Why Therapists Love Renove</h2>
            <p className="text-[var(--fg-secondary)] max-w-2xl mx-auto text-lg">
              We provide the tools. You provide the care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)] flex items-center justify-center mb-6">
                <CalendarClock size={28} style={{ color: "var(--accent-secondary)" }} />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Availability</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                You control your hours. Set your availability block by block, and let clients book sessions that perfectly fit your schedule.
              </p>
            </div>

            {/* Video */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)] flex items-center justify-center mb-6">
                <Video size={28} style={{ color: "var(--accent-secondary)" }} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Video Sessions</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Conduct high-quality, encrypted WebRTC video sessions natively inside the platform without relying on third-party links like Zoom.
              </p>
            </div>

            {/* AI Assistant context */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)] flex items-center justify-center mb-6">
                <BarChart size={28} style={{ color: "var(--accent-secondary)" }} />
              </div>
              <h3 className="text-xl font-bold mb-3">Better Patient Context</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Because our AI tracks user moods and journals between sessions, you step into every appointment with clear, structured context on the patient's week.
              </p>
            </div>

            {/* Wallet */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)] flex items-center justify-center mb-6">
                <Wallet size={28} style={{ color: "var(--accent-secondary)" }} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Wallet Tracking</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Track your earnings from every session in real-time. Our integrated Stripe wallet system ensures secure, frictionless payouts directly to your bank.
              </p>
            </div>

            {/* Messaging */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)] flex items-center justify-center mb-6">
                <MessageSquare size={28} style={{ color: "var(--accent-secondary)" }} />
              </div>
              <h3 className="text-xl font-bold mb-3">Direct Patient Messaging</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                Check in on clients between appointments via a secure, encrypted messaging portal built specifically to protect patient privacy.
              </p>
            </div>

            {/* Safety */}
            <div className="glass-card p-8 rounded-[1.5rem] flex flex-col items-start spotlight-card hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)] flex items-center justify-center mb-6">
                <ShieldCheck size={28} style={{ color: "var(--accent-secondary)" }} />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Community</h3>
              <p className="text-[var(--fg-secondary)] text-sm leading-relaxed">
                A safe ecosystem with a robust reporting system. Both you and your clients are protected, and verified reviews help build your practice's reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ───────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden bg-[var(--bg-base)]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="cinematic-headline mb-6 text-glow">Build Your Practice with Renove</h2>
          <p className="text-[var(--fg-secondary)] text-lg mb-10 max-w-2xl mx-auto">
            Expand your reach, streamline your administration, and join a next-generation ecosystem dedicated to mental wellness.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button 
              variant="primary" 
              className="!text-lg !px-10 !py-4"
              style={{ backgroundColor: 'var(--accent-secondary)', color: 'white', boxShadow: '0 0 30px var(--accent-glow-secondary)' }}
              onClick={() => navigate('/therapist/register')}
            >
              Apply as a Therapist
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 scan-line pointer-events-none opacity-50" />
      </section>

      {/* ─── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--accent-secondary)] to-[var(--accent-glow-secondary)] flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Renove Providers</span>
          </div>
          
          <div className="flex gap-6 text-sm text-[var(--fg-muted)]">
            <span className="hover:text-[var(--fg-primary)] cursor-pointer transition-colors">Provider Terms</span>
            <span className="hover:text-[var(--fg-primary)] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[var(--fg-primary)] cursor-pointer transition-colors">Provider Support</span>
          </div>
          
          <p className="text-sm text-[var(--fg-muted)]">
            &copy; {new Date().getFullYear()} Renove. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
