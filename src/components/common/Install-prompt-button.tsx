import { Download } from "lucide-react";
import { useInstallPrompt } from "../../pwa/hooks/use-install-prompt";

export const InstallPromptButton = () => {
  const { canInstall, handleInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={handleInstall}
      title="Install reNove App"
      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-200"
      style={{
        background: "var(--accent-glow)",
        color: "var(--accent-primary)",
        border: "1px solid var(--border-accent)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.opacity = "0.8";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
      }}
    >
      <Download size={12} />
      Install App
    </button>
  );
};