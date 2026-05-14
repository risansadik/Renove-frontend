import { useThemeStore } from "../../store/use-theme-store.js";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl transition-all duration-300 hover:bg-brand-900/5 dark:hover:bg-brand-100/10 group relative"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="relative w-6 h-6 overflow-hidden">
        <div
          className={`absolute inset-0 transition-transform duration-500 flex items-center justify-center ${
            theme === "dark" ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Sun size={20} className="text-brand-300 group-hover:text-brand-400" />
        </div>
        <div
          className={`absolute inset-0 transition-transform duration-500 flex items-center justify-center ${
            theme === "dark" ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <Moon size={20} className="text-brand-600 group-hover:text-brand-700" />
        </div>
      </div>
    </button>
  );
};
