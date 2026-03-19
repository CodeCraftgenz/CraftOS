/// Hook simplificado para consumir métricas do sistema

import { useEffect } from "react";
import { useSystemStore } from "../stores/systemStore";

export function useSystemMetrics(intervalMs = 2000) {
  const store = useSystemStore();

  useEffect(() => {
    store.startMonitoring(intervalMs);
    return () => store.stopMonitoring();
  }, [intervalMs]);

  return {
    metrics: store.metrics,
    history: store.history,
    isLoading: !store.metrics,
    error: store.error,
  };
}
