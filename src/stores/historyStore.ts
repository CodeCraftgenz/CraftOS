/// Store de histórico — com selectors granulares

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import type { CleanupAction, AppLog, LogLevel } from "../types";

interface HistoryState {
  actions: CleanupAction[];
  logs: AppLog[];
  addAction: (action: CleanupAction) => void;
  addLog: (level: LogLevel, message: string, context?: string) => void;
  clearActions: () => void;
  clearLogs: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
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
    { name: "craftos-history" }
  )
);

// ==========================================
// SELECTORS
// ==========================================

export const useActions = () => useHistoryStore((s) => s.actions);
export const useLogs = () => useHistoryStore((s) => s.logs);

export const useHistoryActions = () =>
  useHistoryStore(
    useShallow((s) => ({
      addAction: s.addAction,
      addLog: s.addLog,
      clearActions: s.clearActions,
      clearLogs: s.clearLogs,
    }))
  );
