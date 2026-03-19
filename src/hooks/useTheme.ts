/// Hook de tema (Dark/Light mode)
/// Aplica classe no <html> e sincroniza com o settingsStore

import { useEffect } from "react";
import { useSettingsStore } from "../stores/settingsStore";

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [theme]);

  return theme;
}
