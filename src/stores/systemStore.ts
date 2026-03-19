/// Store de métricas do sistema — com selectors granulares para evitar re-renders
///
/// REGRA: nunca use `useSystemStore()` direto nos componentes.
/// Use os hooks seletores exportados abaixo.

import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import type { SystemMetrics, ResourceHistory } from "../types";
import { getSystemMetrics, getResourceHistory } from "../services/tauri-commands";

interface SystemState {
  metrics: SystemMetrics | null;
  history: ResourceHistory[];
  error: string | null;
  _intervalId: number | null;

  // Ações (estáveis — não causam re-render)
  fetchMetrics: () => Promise<void>;
  fetchHistory: (limit?: number) => Promise<void>;
  startMonitoring: (intervalMs?: number) => void;
  stopMonitoring: () => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  metrics: null,
  history: [],
  error: null,
  _intervalId: null,

  fetchMetrics: async () => {
    try {
      const metrics = await getSystemMetrics();
      set({ metrics, error: null });
    } catch (error) {
      set({ error: String(error) });
    }
  },

  fetchHistory: async (limit = 100) => {
    try {
      const history = await getResourceHistory(limit);
      set({ history });
    } catch (error) {
      set({ error: String(error) });
    }
  },

  startMonitoring: (intervalMs = 2000) => {
    const { _intervalId } = get();
    if (_intervalId) return;

    get().fetchMetrics();

    const id = window.setInterval(() => {
      get().fetchMetrics();
    }, intervalMs);

    set({ _intervalId: id });
  },

  stopMonitoring: () => {
    const { _intervalId } = get();
    if (_intervalId) {
      window.clearInterval(_intervalId);
      set({ _intervalId: null });
    }
  },
}));

// ==========================================
// SELECTORS GRANULARES — use estes nos componentes
// ==========================================

/** Apenas as métricas (CPU, RAM, discos) — re-renderiza só quando mudam */
export const useMetrics = () => useSystemStore((s) => s.metrics);

/** Apenas o histórico — re-renderiza só quando muda */
export const useResourceHistory = () => useSystemStore((s) => s.history);

/** Apenas o erro */
export const useSystemError = () => useSystemStore((s) => s.error);

/** Apenas as ações — referência estável, nunca causa re-render */
export const useSystemActions = () =>
  useSystemStore(
    useShallow((s) => ({
      fetchMetrics: s.fetchMetrics,
      fetchHistory: s.fetchHistory,
      startMonitoring: s.startMonitoring,
      stopMonitoring: s.stopMonitoring,
    }))
  );

/** Dados de disco extraídos das métricas */
export const useDisks = () => useSystemStore((s) => s.metrics?.disks ?? []);
