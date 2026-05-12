import type { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    panel?: ReactNode;
}

export const AuthLayout = ({ children, panel }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen bg-surface flex">
            <aside className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12">

                <div className="absolute inset-0 bg-linear-to-br from-brand-900/80 via-surface to-surface" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-sage-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
                <div className="absolute top-1/2 right-0 w-60 h-60 bg-lavender-400/10 rounded-full blur-3xl" />

                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                            <span className="text-white font-display font-bold text-sm">r</span>
                        </div>
                        <span className="font-display font-bold text-xl text-white tracking-tight">
                            reNove
                        </span>
                    </div>
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    {panel ?? <DefaultPanel />}
                </div>

                <div className="relative z-10 text-white/20 text-xs font-body">
                    &copy; 2025 reNove. Recovery reimagined.
                </div>
            </aside>

            <main className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md animate-fade-up">
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                            <span className="text-white font-display font-bold text-xs">r</span>
                        </div>
                        <span className="font-display font-bold text-lg text-white">reNove</span>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
};

const DefaultPanel = () => (
    <div>
        <p className="text-brand-400 text-sm font-mono mb-4 tracking-widest uppercase">
            Recovery reimagined
        </p>
        <h2 className="font-display text-4xl font-bold text-white leading-tight mb-6">
            Your journey to freedom <span className="text-brand-400">starts here.</span>
        </h2>
        <p className="text-white/50 text-base leading-relaxed">
            An AI-powered platform that transforms addiction recovery into a guided progression
            journey, with therapist support, gamified milestones, and real-time emotional
            assistance.
        </p>
        <div className="mt-10 flex flex-col gap-4">
            {[
                { n: "30", label: "Recovery levels" },
                { n: "AI", label: "Emotional support" },
                { n: "24/7", label: "Therapist access" },
            ].map(({ n, label }) => (
                <div key={n} className="flex items-center gap-4">
    
                    <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
                        <span className="text-lavender-400 font-display font-bold text-sm">{n}</span>
                    </div>
                    <span className="text-white/60 text-sm">{label}</span>
                </div>
            ))}
        </div>
    </div>
);
