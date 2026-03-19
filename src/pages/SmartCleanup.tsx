/// Limpeza Inteligente — análise, seleção e limpeza interativa

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { useHistoryActions } from "../stores/historyStore";
import {
  getCleanupSuggestions,
  cleanTempDirectory,
  deleteToTrash,
  getCategoryDetails,
} from "../services/tauri-commands";
import { formatBytes } from "../utils/format";
import type { CleanupSuggestion, FileDetail } from "../types";

// ==========================================
// Ícones SVG
// ==========================================

const PageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const AnalyzeIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CleanIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FolderIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const FileIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);

const CheckIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ==========================================
// Tipos internos
// ==========================================

interface CleaningProgress {
  current: string;
  processed: number;
  total: number;
  freed: number;
}

interface ConfirmAction {
  category: string;
  paths: string[];
  size: number;
  risk: string;
}

// ==========================================
// Componente de Checkbox customizado
// ==========================================

function Checkbox({
  checked,
  indeterminate,
  onChange,
  disabled,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      disabled={disabled}
      className={`
        w-[18px] h-[18px] rounded flex items-center justify-center border transition-all duration-150
        flex-shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
        ${checked || indeterminate
          ? "bg-primary border-primary text-white"
          : "bg-bg-input border-border hover:border-border-light"
        }
      `}
    >
      {checked && <CheckIcon />}
      {indeterminate && !checked && (
        <span className="w-2 h-0.5 bg-white rounded-full" />
      )}
    </button>
  );
}

// ==========================================
// Componente principal
// ==========================================

export function SmartCleanup() {
  // Estado principal
  const [suggestions, setSuggestions] = useState<CleanupSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [categoryDetails, setCategoryDetails] = useState<Record<string, FileDetail[]>>({});
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());

  // Estado de limpeza
  const [cleaningProgress, setCleaningProgress] = useState<CleaningProgress | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const { addAction, addLog } = useHistoryActions();

  // ==========================================
  // Carrega sugestões automaticamente ao montar
  // ==========================================

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setSelectedPaths(new Set());
    setExpandedCategories(new Set());
    setCategoryDetails({});
    try {
      const results = await getCleanupSuggestions();
      setSuggestions(results);
      addLog("Info", `Análise concluída: ${results.length} categorias encontradas`);
    } catch (error) {
      addLog("Error", `Erro ao analisar: ${error}`);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // ==========================================
  // Expande categoria e carrega detalhes
  // ==========================================

  const toggleCategory = async (category: string, paths: string[]) => {
    const next = new Set(expandedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
      // Carrega detalhes se ainda não foram carregados
      if (!categoryDetails[category] && paths.length > 0) {
        setLoadingDetails((prev) => new Set(prev).add(category));
        try {
          const firstPath = paths[0];
          const details = await getCategoryDetails(firstPath);
          setCategoryDetails((prev) => ({ ...prev, [category]: details }));
        } catch {
          // Se falhar, usa os paths como fallback
          setCategoryDetails((prev) => ({
            ...prev,
            [category]: paths.map((p) => ({
              path: p,
              name: p.split("\\").pop() || p,
              size: 0,
              is_dir: false,
              modified_at: 0,
            })),
          }));
        } finally {
          setLoadingDetails((prev) => {
            const next = new Set(prev);
            next.delete(category);
            return next;
          });
        }
      }
    }
    setExpandedCategories(next);
  };

  // ==========================================
  // Seleção de paths
  // ==========================================

  const togglePath = (path: string) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const toggleAllInCategory = (suggestion: CleanupSuggestion) => {
    const paths = categoryDetails[suggestion.category]
      ? categoryDetails[suggestion.category].map((d) => d.path)
      : suggestion.paths;

    const allSelected = paths.every((p) => selectedPaths.has(p));

    setSelectedPaths((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        paths.forEach((p) => next.delete(p));
      } else {
        paths.forEach((p) => next.add(p));
      }
      return next;
    });
  };

  const selectAll = () => {
    const allPaths = suggestions.flatMap((s) => {
      const details = categoryDetails[s.category];
      return details ? details.map((d) => d.path) : s.paths;
    });
    setSelectedPaths(new Set(allPaths));
  };

  const deselectAll = () => {
    setSelectedPaths(new Set());
  };

  // ==========================================
  // Cálculos de seleção
  // ==========================================

  const selectedSize = suggestions.reduce((total, s) => {
    const details = categoryDetails[s.category];
    if (details) {
      return total + details
        .filter((d) => selectedPaths.has(d.path))
        .reduce((sum, d) => sum + d.size, 0);
    }
    // Fallback: se todos selecionados, soma total_size proporcional
    const selectedCount = s.paths.filter((p) => selectedPaths.has(p)).length;
    if (selectedCount === s.paths.length) return total + s.total_size;
    if (selectedCount === 0) return total;
    return total + (s.total_size / s.paths.length) * selectedCount;
  }, 0);

  const totalPotential = suggestions.reduce((sum, s) => sum + s.total_size, 0);

  const getCategorySelectedCount = (suggestion: CleanupSuggestion) => {
    const paths = categoryDetails[suggestion.category]
      ? categoryDetails[suggestion.category].map((d) => d.path)
      : suggestion.paths;
    return paths.filter((p) => selectedPaths.has(p)).length;
  };

  const getCategoryTotalCount = (suggestion: CleanupSuggestion) => {
    return categoryDetails[suggestion.category]?.length ?? suggestion.paths.length;
  };

  // ==========================================
  // Confirmação e Limpeza
  // ==========================================

  const requestCleanSelected = () => {
    if (selectedPaths.size === 0) return;
    setConfirmAction({
      category: "Itens Selecionados",
      paths: Array.from(selectedPaths),
      size: selectedSize,
      risk: "variado",
    });
  };

  const requestCleanCategory = (suggestion: CleanupSuggestion) => {
    const paths = categoryDetails[suggestion.category]
      ? categoryDetails[suggestion.category].map((d) => d.path)
      : suggestion.paths;
    setConfirmAction({
      category: suggestion.category,
      paths,
      size: suggestion.total_size,
      risk: suggestion.risk_level,
    });
  };

  const executeCleanup = async () => {
    if (!confirmAction) return;
    setConfirmAction(null);

    const { paths, category } = confirmAction;
    let totalFreed = 0;
    let errors = 0;

    setCleaningProgress({ current: "", processed: 0, total: paths.length, freed: 0 });

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const name = path.split("\\").pop() || path;

      setCleaningProgress({
        current: name,
        processed: i,
        total: paths.length,
        freed: totalFreed,
      });

      try {
        const action = await deleteToTrash(path);
        totalFreed += action.size_freed;
        addAction(action);
      } catch {
        try {
          const action = await cleanTempDirectory(path);
          totalFreed += action.size_freed;
          addAction(action);
        } catch {
          errors++;
        }
      }
    }

    setCleaningProgress(null);

    addLog(
      errors > 0 ? "Warning" : "Info",
      `Limpeza "${category}": ${formatBytes(totalFreed)} liberados. ${errors > 0 ? `${errors} erros.` : "Sem erros."}`
    );

    // Recarrega sugestões
    await fetchSuggestions();
  };

  // ==========================================
  // Helpers de estilo
  // ==========================================

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case "baixo": return "text-success bg-success/10 border-success/20";
      case "médio": return "text-warning bg-warning/10 border-warning/20";
      case "alto": return "text-danger bg-danger/10 border-danger/20";
      default: return "text-text-muted bg-bg-elevated border-border";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "baixo": return "🟢";
      case "médio": return "🟡";
      case "alto": return "🔴";
      default: return "⚪";
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Limpeza Inteligente"
        subtitle="Analise e libere espaço em disco com segurança"
        icon={PageIcon}
        actions={
          <div className="flex items-center gap-3">
            <Button onClick={fetchSuggestions} loading={loading} variant="outline" icon={AnalyzeIcon}>
              Analisar
            </Button>
            {selectedPaths.size > 0 && (
              <Button onClick={requestCleanSelected} variant="primary" icon={CleanIcon}>
                Limpar Selecionados ({selectedPaths.size})
              </Button>
            )}
          </div>
        }
      />

      {/* ==========================================
          Cards de resumo
          ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-static p-5">
          <p className="text-[11px] text-text-muted uppercase tracking-[0.06em] font-semibold mb-1">
            Espaço Identificado
          </p>
          <p className="text-[28px] font-extrabold text-primary-light tracking-tight">
            {formatBytes(totalPotential)}
          </p>
          <p className="text-[12px] text-text-muted mt-1">
            {suggestions.length} categoria{suggestions.length !== 1 ? "s" : ""} encontrada{suggestions.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="card-static p-5">
          <p className="text-[11px] text-text-muted uppercase tracking-[0.06em] font-semibold mb-1">
            Selecionado para Limpeza
          </p>
          <p className={`text-[28px] font-extrabold tracking-tight ${selectedPaths.size > 0 ? "text-warning" : "text-text-muted"}`}>
            {selectedPaths.size > 0 ? formatBytes(selectedSize) : "—"}
          </p>
          <p className="text-[12px] text-text-muted mt-1">
            {selectedPaths.size} item(ns) selecionado{selectedPaths.size !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="card-static p-5 flex flex-col justify-between">
          <div>
            <p className="text-[11px] text-text-muted uppercase tracking-[0.06em] font-semibold mb-1">
              Ações Rápidas
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={selectAll} disabled={suggestions.length === 0}>
              Selecionar Tudo
            </Button>
            <Button size="sm" variant="ghost" onClick={deselectAll} disabled={selectedPaths.size === 0}>
              Limpar Seleção
            </Button>
          </div>
        </div>
      </div>

      {/* ==========================================
          Progresso de limpeza (overlay inline)
          ========================================== */}
      {cleaningProgress && (
        <div className="card-static p-6 gradient-info animate-fade-in-scale">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <svg className="animate-spin w-5 h-5 text-info" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="text-[14px] font-semibold text-text-primary">Limpando...</span>
            </div>
            <span className="text-[13px] text-text-secondary font-mono">
              {cleaningProgress.processed}/{cleaningProgress.total}
            </span>
          </div>

          {/* Barra de progresso */}
          <div className="w-full h-2 bg-bg-app/60 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-info rounded-full transition-all duration-300"
              style={{ width: `${(cleaningProgress.processed / cleaningProgress.total) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[12px] text-text-muted truncate max-w-[60%]">
              {cleaningProgress.current}
            </p>
            <p className="text-[12px] text-info font-semibold">
              {formatBytes(cleaningProgress.freed)} liberados
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          Diálogo de confirmação inline
          ========================================== */}
      {confirmAction && (
        <div className="card-static p-6 border-warning/30 animate-fade-in-scale">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-text-primary mb-1">Confirmar Limpeza</h3>
              <p className="text-[13px] text-text-secondary mb-3">
                Você está prestes a limpar <strong>{confirmAction.paths.length} itens</strong> da
                categoria "<strong>{confirmAction.category}</strong>".
                Isso liberará aproximadamente <strong className="text-primary-light">{formatBytes(confirmAction.size)}</strong>.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className={`badge border ${getRiskStyle(confirmAction.risk)}`}>
                  {getRiskIcon(confirmAction.risk)} Risco {confirmAction.risk}
                </span>
                <span className="text-[11px] text-text-muted">
                  Itens serão enviados para a lixeira quando possível
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="danger" onClick={executeCleanup}>
                  Confirmar Limpeza
                </Button>
                <Button variant="ghost" onClick={() => setConfirmAction(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          Loading state
          ========================================== */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-static p-5">
              <div className="flex items-center gap-4">
                <div className="skeleton w-[18px] h-[18px] rounded" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-48 rounded" />
                  <div className="skeleton h-3 w-72 rounded" />
                </div>
                <div className="skeleton h-4 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================
          Lista de categorias
          ========================================== */}
      {!loading && (
        <div className="space-y-3">
          {suggestions.map((suggestion) => {
            const isExpanded = expandedCategories.has(suggestion.category);
            const details = categoryDetails[suggestion.category];
            const isLoadingDetail = loadingDetails.has(suggestion.category);
            const selectedCount = getCategorySelectedCount(suggestion);
            const totalCount = getCategoryTotalCount(suggestion);
            const allSelected = totalCount > 0 && selectedCount === totalCount;
            const someSelected = selectedCount > 0 && selectedCount < totalCount;

            return (
              <div key={suggestion.category} className="card overflow-hidden">
                {/* Cabeçalho da categoria */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer select-none hover:bg-bg-card-hover transition-colors"
                  onClick={() => toggleCategory(suggestion.category, suggestion.paths)}
                >
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={() => toggleAllInCategory(suggestion)}
                    disabled={!!cleaningProgress}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-[14px] font-semibold text-text-primary">
                        {suggestion.category}
                      </h3>
                      <span className={`badge border ${getRiskStyle(suggestion.risk_level)}`}>
                        Risco {suggestion.risk_level}
                      </span>
                      {selectedCount > 0 && (
                        <span className="badge bg-primary/15 text-primary-light border-primary/20 border">
                          {selectedCount} selecionado{selectedCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-text-muted">{suggestion.description}</p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[16px] font-bold text-primary-light font-mono">
                        {formatBytes(suggestion.total_size)}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {suggestion.paths.length} item(ns)
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={suggestion.risk_level === "alto" ? "danger" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        requestCleanCategory(suggestion);
                      }}
                      disabled={!!cleaningProgress}
                    >
                      Limpar
                    </Button>
                    <span className="text-text-muted">
                      <ChevronIcon open={isExpanded} />
                    </span>
                  </div>
                </div>

                {/* Conteúdo expandido */}
                {isExpanded && (
                  <div className="border-t border-border animate-fade-in">
                    {isLoadingDetail ? (
                      <div className="p-5 space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="skeleton w-4 h-4 rounded" />
                            <div className="skeleton h-3 flex-1 rounded" />
                            <div className="skeleton h-3 w-16 rounded" />
                          </div>
                        ))}
                      </div>
                    ) : details && details.length > 0 ? (
                      <div className="max-h-[320px] overflow-y-auto">
                        {/* Cabeçalho da tabela */}
                        <div className="flex items-center gap-3 px-5 py-2 bg-bg-app/40 text-[11px] text-text-muted uppercase tracking-[0.06em] font-semibold sticky top-0 z-10">
                          <span className="w-[18px]" />
                          <span className="w-[14px]" />
                          <span className="flex-1">Nome</span>
                          <span className="w-24 text-right">Tamanho</span>
                          <span className="w-28 text-right">Modificado</span>
                        </div>
                        {details.map((detail) => (
                          <div
                            key={detail.path}
                            className={`
                              flex items-center gap-3 px-5 py-2.5 text-[13px] transition-colors cursor-pointer
                              hover:bg-bg-card-hover
                              ${selectedPaths.has(detail.path) ? "bg-primary/5" : ""}
                            `}
                            onClick={() => togglePath(detail.path)}
                          >
                            <Checkbox
                              checked={selectedPaths.has(detail.path)}
                              onChange={() => togglePath(detail.path)}
                              disabled={!!cleaningProgress}
                            />
                            <span className="text-text-muted flex-shrink-0">
                              {detail.is_dir ? FolderIcon : FileIcon}
                            </span>
                            <span className="flex-1 truncate text-text-secondary" title={detail.path}>
                              {detail.name}
                            </span>
                            <span className="w-24 text-right font-mono text-text-muted text-[12px]">
                              {detail.size > 0 ? formatBytes(detail.size) : "—"}
                            </span>
                            <span className="w-28 text-right text-text-muted text-[12px]">
                              {formatDate(detail.modified_at)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 text-center">
                        <p className="text-[13px] text-text-muted">
                          {suggestion.paths.length} caminhos nesta categoria
                        </p>
                        <div className="mt-3 space-y-1.5 max-h-[200px] overflow-y-auto">
                          {suggestion.paths.slice(0, 20).map((path) => (
                            <div
                              key={path}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-card-hover cursor-pointer"
                              onClick={() => togglePath(path)}
                            >
                              <Checkbox
                                checked={selectedPaths.has(path)}
                                onChange={() => togglePath(path)}
                              />
                              <span className="text-[12px] text-text-secondary truncate">{path}</span>
                            </div>
                          ))}
                          {suggestion.paths.length > 20 && (
                            <p className="text-[11px] text-text-muted pt-2">
                              ...e mais {suggestion.paths.length - 20} itens
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Estado vazio */}
          {suggestions.length === 0 && !loading && (
            <div className="card-static p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-light">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-[16px] font-semibold text-text-primary mb-2">
                Seu sistema está limpo!
              </h3>
              <p className="text-[13px] text-text-muted max-w-[380px] mx-auto">
                Não encontramos arquivos temporários, caches ou downloads antigos para limpar.
                Clique em "Analisar" para verificar novamente.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
