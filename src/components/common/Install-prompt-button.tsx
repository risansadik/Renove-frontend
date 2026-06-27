import { Download, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { useInstallPrompt } from "../../pwa/hooks/use-install-prompt";

export const InstallPromptButton = () => {
    const { canInstall, handleInstall } = useInstallPrompt();
    const [dismissed, setDismissed] = useState(
        () => localStorage.getItem("pwa-banner-dismissed") === "true"
    );

    if (!canInstall || dismissed) return null;

    const handleDismiss = () => {
        localStorage.setItem("pwa-banner-dismissed", "true");
        setDismissed(true);
    };

    return (
        <>
            {/* Desktop — header button */}
            <button
                type="button"
                onClick={handleInstall}
                title="Install reNove App"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-200"
                style={{
                    background: "var(--accent-glow)",
                    color: "var(--accent-primary)",
                    border: "1px solid var(--border-accent)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
                <Download size={12} />
                Install App
            </button>

            {/* Mobile — bottom banner */}
            <div
                className="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-4"
                style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border-accent)" }}
            >
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #6b4c7a, #b89bbe)" }}
                    >
                        <Sparkles size={16} className="text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--fg-default)" }}>
                            Install reNove
                        </p>
                        <p className="text-xs truncate" style={{ color: "var(--fg-muted)" }}>
                            Add to home screen for quick access
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            type="button"
                            onClick={handleInstall}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                            style={{
                                background: "var(--accent-primary)",
                                color: "#ffffff",
                            }}
                        >
                            Install
                        </button>
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="p-1.5 rounded-lg transition-all duration-200"
                            style={{ color: "var(--fg-muted)" }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};