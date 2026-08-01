import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    () => ({
      theme: "dark" as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
    }),
    {
      name: "renove-theme",
      onRehydrateStorage: () => (state) => {
        // Force dark mode regardless of stored state
        if (state) {
          state.theme = "dark";
        }
        document.documentElement.classList.add("dark");
      },
    }
  )
);
