/// Store de histórico de ações e logs

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CleanupAction, AppLog, LogLevel } from "../types";

interface HistoryState {
  actions: CleanupAction[];
  logs: AppLog[];

  // Ações
  addAction: (action: CleanupAction) => void;
  addLog: (level: LogLevel, message: string, context?: string) => void;
  clearActions: () => void;
  clearLogs: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      actions: [],
      logs: [],

      addAction: (action: CleanupAction) =>
        set((state) => ({
          actions: [action, ...state.actions].slice(0, 500),
        })),

      addLog: (level: LogLevel, message: string, context?: string) =>
        set((state) => ({
          logs: [
            {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              level,
              message,
              context: context ?? null,
            },
            ...state.logs,
          ].slice(0, 1000),
        })),

      clearActions: () => set({ actions: [] }),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "tracos-history",
    }
  )
);
