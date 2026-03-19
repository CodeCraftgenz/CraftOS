/// Store de métricas do sistema — CPU, RAM, discos em tempo real

import { create } from "zustand";
import type { SystemMetrics, ResourceHistory } from "../types";
import { getSystemMetrics, getResourceHistory } from "../services/tauri-commands";

interface SystemState {
  metrics: SystemMetrics | null;
  history: ResourceHistory[];
  isLoading: boolean;
  error: string | null;
  intervalId: number | null;

  // Ações
  fetchMetrics: () => Promise<void>;
  fetchHistory: (limit?: number) => Promise<void>;
  startMonitoring: (intervalMs?: number) => void;
  stopMonitoring: () => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  metrics: null,
  history: [],
  isLoading: false,
  error: null,
  intervalId: null,

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
    const { intervalId } = get();
    if (intervalId) return;

    // Busca imediata
    get().fetchMetrics();

    const id = window.setInterval(() => {
      get().fetchMetrics();
    }, intervalMs);

    set({ intervalId: id });
  },

  stopMonitoring: () => {
    const { intervalId } = get();
    if (intervalId) {
      window.clearInterval(intervalId);
      set({ intervalId: null });
    }
  },
}));
