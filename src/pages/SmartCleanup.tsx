/// Limpeza Inteligente — sugestões e ações de limpeza

import { useState, useEffect } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { useHistoryStore } from "../stores/historyStore";
import { useDiskStore } from "../stores/diskStore";
import { getCleanupSuggestions, cleanTempDirectory } from "../services/tauri-commands";
import { formatBytes } from "../utils/format";
import type { CleanupSuggestion } from "../types";

const PageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
  </svg>
);

const RefreshIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export function SmartCleanup() {
  const [suggestions, setSuggestions] = useState<CleanupSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState<string | null>(null);
  const { addAction, addLog } = useHistoryStore();
  const { scanResult } = useDiskStore();

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const systemSuggestions = await getCleanupSuggestions();
      const scanSuggestions = scanResult?.suggestions ?? [];
      setSuggestions([...systemSuggestions, ...scanSuggestions]);
      addLog("Info", "Sugestões de limpeza carregadas");
    } catch (error) {
      addLog("Error", `Erro ao buscar sugestões: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Carrega sugestões do scan local (sem chamada pesada ao backend)
  useEffect(() => {
    if (scanResult?.suggestions) {
      setSuggestions(scanResult.suggestions);
    }
  }, [scanResult]);

  const handleClean = async (suggestion: CleanupSuggestion) => {
    const confirmed = window.confirm(
      `Deseja limpar "${suggestion.category}"?\n\nIsso liberará aproximadamente ${formatBytes(suggestion.total_size)}.\n\nRisco: ${suggestion.risk_level}`
    );
    if (!confirmed) return;

    setCleaning(suggestion.category);
    try {
      for (const path of suggestion.paths) {
        const action = await cleanTempDirectory(path);
        addAction(action);
      }
      addLog("Info", `Limpeza concluída: ${suggestion.category}`);
      await fetchSuggestions();
    } catch (error) {
      addLog("Error", `Erro na limpeza: ${error}`);
    } finally {
      setCleaning(null);
    }
  };

  const totalPotential = suggestions.reduce((sum, s) => sum + s.total_size, 0);

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case "baixo": return "text-success bg-success/10 border-success/20";
      case "médio": return "text-warning bg-warning/10 border-warning/20";
      case "alto": return "text-danger bg-danger/10 border-danger/20";
      default: return "text-text-muted bg-bg-elevated border-border";
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Limpeza Inteligente"
        subtitle="Sugestões automáticas para liberar espaço em disco"
        icon={PageIcon}
        actions={
          <Button onClick={fetchSuggestions} loading={loading} variant="outline" icon={RefreshIcon}>
            Atualizar
          </Button>
        }
      />

      {/* Potencial */}
      <div className="card-static p-8 text-center gradient-success">
        <p className="text-[11px] text-text-muted uppercase tracking-[0.08em] font-semibold mb-2">
          Potencial de limpeza identificado
        </p>
        <p className="text-[36px] font-extrabold text-primary-light tracking-tight">{formatBytes(totalPotential)}</p>
        <p className="text-[13px] text-text-muted mt-1">
          em {suggestions.length} categoria{suggestions.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Sugestões */}
      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="text-[14px] font-semibold text-text-primary">{suggestion.category}</h3>
                  <span className={`badge border ${getRiskStyle(suggestion.risk_level)}`}>
                    Risco {suggestion.risk_level}
                  </span>
                </div>
                <p className="text-[12px] text-text-muted truncate">{suggestion.description}</p>
                <p className="text-[11px] text-text-muted mt-1">
                  {suggestion.paths.length} item(ns)
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-[18px] font-bold text-primary-light font-mono">
                  {formatBytes(suggestion.total_size)}
                </span>
                <Button
                  size="sm"
                  variant={suggestion.risk_level === "alto" ? "danger" : "primary"}
                  onClick={() => handleClean(suggestion)}
                  loading={cleaning === suggestion.category}
                >
                  Limpar
                </Button>
              </div>
            </div>
          </div>
        ))}

        {suggestions.length === 0 && !loading && (
          <div className="card-static p-12 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-light mx-auto mb-4">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-text-secondary text-[14px]">Seu sistema está limpo!</p>
          </div>
        )}
      </div>
    </div>
  );
}
