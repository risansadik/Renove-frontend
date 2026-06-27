import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
    interface Window {
        _installPromptEvent: BeforeInstallPromptEvent | null;
    }
}

export const useInstallPrompt = () => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(
        window._installPromptEvent ?? null
    );
    const [isInstalled, setIsInstalled] = useState(
        window.matchMedia("(display-mode: standalone)").matches
    );

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            const prompt = e as BeforeInstallPromptEvent;
            window._installPromptEvent = prompt;
            setInstallPrompt(prompt);
        };

        window.addEventListener("beforeinstallprompt", handler);
        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            window._installPromptEvent = null;
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return;
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === "accepted") {
            setInstallPrompt(null);
            setIsInstalled(true);
            window._installPromptEvent = null;
        }
    };

    return { canInstall: !!installPrompt && !isInstalled, handleInstall };
};