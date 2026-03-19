/// Hook otimizado para métricas do sistema
/// Gerencia lifecycle de monitoramento com cleanup automático

import { useEffect, useRef, useCallback } from "react";
import { useMetrics, useResourceHistory, useSystemActions } from "../stores/systemStore";

interface UseSystemMetricsOptions {
  /** Intervalo de polling em ms (default: 2000) */
  interval?: number;
  /** Intervalo de atualização do histórico em ms (default: 10000) */
  historyInterval?: number;
  /** Limite de pontos no histórico (default: 60) */
  historyLimit?: number;
  /** Ativar monitoramento automaticamente (default: true) */
  autoStart?: boolean;
}

export function useSystemMetrics(options: UseSystemMetricsOptions = {}) {
  const {
    interval = 2000,
    historyInterval = 10000,
    historyLimit = 60,
    autoStart = true,
  } = options;

  const metrics = useMetrics();
  const history = useResourceHistory();
  const { startMonitoring, stopMonitoring, fetchHistory } = useSystemActions();

  // Refs para evitar stale closures no interval
  const historyLimitRef = useRef(historyLimit);
  historyLimitRef.current = historyLimit;

  const fetchHistoryStable = useCallback(() => {
    fetchHistory(historyLimitRef.current);
  }, [fetchHistory]);

  useEffect(() => {
    if (!autoStart) return;

    startMonitoring(interval);
    fetchHistoryStable();

    const histId = window.setInterval(fetchHistoryStable, historyInterval);

    return () => {
      stopMonitoring();
      clearInterval(histId);
    };
  }, [autoStart, interval, historyInterval, startMonitoring, stopMonitoring, fetchHistoryStable]);

  return {
    metrics,
    history,
    isLoading: !metrics,
  };
}
