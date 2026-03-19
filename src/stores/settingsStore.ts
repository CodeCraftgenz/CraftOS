/// Store de configurações do usuário

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "../types";

interface SettingsState extends UserSettings {
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  update_interval: 2000,
  ignored_paths: [],
  safe_mode: true,
  theme: "dark",
  size_unit: "auto",
  auto_cleanup: false,
  max_history_days: 30,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (newSettings: Partial<UserSettings>) =>
        set((state) => ({ ...state, ...newSettings })),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: "tracos-settings",
    }
  )
);
