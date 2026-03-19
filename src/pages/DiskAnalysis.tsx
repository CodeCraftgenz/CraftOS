/// Análise de Disco — estilo WizTree com árvore de pastas navegável

import { useState, useEffect } from "react";
import { useDiskStore } from "../stores/diskStore";
import { useSystemStore } from "../stores/systemStore";
import { useHistoryStore } from "../stores/historyStore";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { formatBytes, getUsageColor, formatPercent } from "../utils/format";
import { openInExplorer } from "../services/tauri-commands";
import type { DirectoryNode } from "../types";

const PageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const ScanIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const StatsIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

/// Linha individual da árvore de pastas
function FolderRow({
  node,
  parentSize,
  depth,
  isExpanded,
  isLoading,
  onToggle,
  onOpen,
}: {
  node: DirectoryNode;
  parentSize: number;
  depth: number;
  isExpanded: boolean;
  isLoading: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const percent = parentSize > 0 ? (node.size / parentSize) * 100 : 0;
  const barColor = getUsageColor(percent);
  const isRootFiles = node.name === "[Arquivos na raiz]";

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-2.5 hover:bg-bg-card-hover transition-colors border-b border-border/30 ${
        depth === 0 ? "" : ""
      }`}
      style={{ paddingLeft: `${16 + depth * 24}px` }}
    >
      {/* Seta de expandir */}
      <button
        onClick={onToggle}
        className="w-5 h-5 flex items-center justify-center flex-shrink-0 cursor-pointer"
        disabled={isRootFiles}
      >
        {isLoading ? (
          <svg className="animate-spin w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : isRootFiles ? (
          <span className="w-3.5" />
        ) : (
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`text-text-muted transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </button>

      {/* Ícone da pasta */}
      <div className="w-6 h-6 rounded-md bg-bg-elevated flex items-center justify-center flex-shrink-0">
        {isRootFiles ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={isExpanded ? "text-primary-light" : "text-warning"}>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </div>

      {/* Nome */}
      <span className="text-[13px] text-text-primary font-medium truncate min-w-[180px] max-w-[300px]">
        {node.name}
      </span>

      {/* Barra de porcentagem */}
      <div className="flex-1 mx-4 min-w-[100px]">
        <div className="w-full h-[6px] bg-bg-app rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      {/* Porcentagem */}
      <span className="text-[12px] font-mono text-text-muted w-14 text-right flex-shrink-0">
        {percent.toFixed(1)}%
      </span>

      {/* Tamanho */}
      <span className="text-[13px] font-mono font-semibold text-primary-light w-24 text-right flex-shrink-0">
        {formatBytes(node.size)}
      </span>

      {/* Itens */}
      <span className="text-[11px] text-text-muted w-16 text-right flex-shrink-0">
        {node.children_count > 0 ? `${node.children_count} itens` : ""}
      </span>

      {/* Ação: abrir no explorador */}
      <button
        onClick={onOpen}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-bg-elevated cursor-pointer flex-shrink-0"
        title="Abrir no explorador"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </button>
    </div>
  );
}

/// Componente recursivo da árvore
function FolderTree({
  nodes,
  parentSize,
  depth,
}: {
  nodes: DirectoryNode[];
  parentSize: number;
  depth: number;
}) {
  const { expandedPaths, childrenCache, isLoadingPath, toggleExpand } = useDiskStore();
  const { addLog } = useHistoryStore();

  const handleOpen = async (path: string) => {
    try {
      await openInExplorer(path);
      addLog("Info", `Abriu: ${path}`);
    } catch (e) {
      addLog("Error", `Erro ao abrir: ${e}`);
    }
  };

  return (
    <>
      {nodes.map((node) => {
        const isExpanded = expandedPaths.has(node.path);
        const children = childrenCache[node.path];
        const isLoading = isLoadingPath === node.path;

        return (
          <div key={node.path}>
            <FolderRow
              node={node}
              parentSize={parentSize}
              depth={depth}
              isExpanded={isExpanded}
              isLoading={isLoading}
              onToggle={() => toggleExpand(node.path)}
              onOpen={() => handleOpen(node.path)}
            />
            {isExpanded && children && children.length > 0 && (
              <FolderTree
                nodes={children}
                parentSize={node.size}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

export function DiskAnalysis() {
  const {
    folderTree, isLoadingPath, isScanning, error, scanResult,
    selectedDisk, setSelectedDisk, loadFolderSizes, runFullScan, clearResults,
  } = useDiskStore();
  const { metrics } = useSystemStore();
  const { addLog } = useHistoryStore();

  const [activeView, setActiveView] = useState<"tree" | "stats">("tree");
  const [customPath, setCustomPath] = useState("");

  // Discos disponíveis do sistema
  const disks = metrics?.disks ?? [];

  // Carrega a árvore quando o usuário clica num disco
  const handleSelectDisk = (disk: string) => {
    setSelectedDisk(disk);
    clearResults();
    loadFolderSizes(disk);
    addLog("Info", `Analisando: ${disk}`);
  };

  const totalSize = folderTree.reduce((sum, f) => sum + f.size, 0);

  const handleCustomScan = () => {
    if (customPath.trim()) {
      setSelectedDisk(customPath.trim());
    }
  };

  const handleFullScan = async () => {
    addLog("Info", `Scan completo: ${selectedDisk}`);
    await runFullScan(selectedDisk, 6);
    addLog("Info", "Scan completo finalizado");
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Análise de Disco"
        subtitle="Navegue pelas pastas e veja onde o espaço está sendo usado"
        icon={PageIcon}
      />

      {/* Seletor de disco + caminho personalizado */}
      <div className="card-static p-6">
        <div className="flex flex-col gap-5">
          {/* Discos disponíveis */}
          {disks.length > 0 && (
            <div>
              <label className="block text-[11px] text-text-muted font-semibold uppercase tracking-[0.06em] mb-3">
                Selecione um disco
              </label>
              <div className="flex flex-wrap gap-3">
                {disks.map((disk, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectDisk(disk.mount_point)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedDisk === disk.mount_point
                        ? "border-primary bg-primary/8 shadow-sm shadow-primary/10"
                        : "border-border bg-bg-app hover:border-border-light hover:bg-bg-card-hover"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                        className={selectedDisk === disk.mount_point ? "text-primary-light" : "text-text-muted"}>
                        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-[14px] font-semibold text-text-primary">
                        {disk.mount_point}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {formatBytes(disk.used_space)} / {formatBytes(disk.total_space)}
                      </p>
                    </div>
                    <div className="ml-3 w-20">
                      <ProgressBar percent={disk.usage_percent} height={4} />
                      <p className="text-[10px] font-mono text-right mt-0.5" style={{ color: getUsageColor(disk.usage_percent) }}>
                        {formatPercent(disk.usage_percent)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Caminho personalizado */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-[11px] text-text-muted font-semibold uppercase tracking-[0.06em] mb-2">
                Ou digite um caminho
              </label>
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomScan()}
                placeholder="Ex: C:\Users\seu-usuario\Documents"
              />
            </div>
            <Button onClick={handleCustomScan} variant="outline" icon={ScanIcon}>
              Analisar
            </Button>
            <Button onClick={handleFullScan} loading={isScanning} icon={StatsIcon}>
              Scan Completo
            </Button>
          </div>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="p-4 bg-danger/8 border border-danger/20 rounded-xl text-[13px] text-danger">
          {error}
        </div>
      )}

      {/* Tabs tree / stats */}
      {(folderTree.length > 0 || scanResult) && (
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-bg-card rounded-xl">
            <button
              onClick={() => setActiveView("tree")}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                activeView === "tree" ? "bg-primary/15 text-primary-light" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              Árvore de Pastas
            </button>
            {scanResult && (
              <button
                onClick={() => setActiveView("stats")}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                  activeView === "stats" ? "bg-primary/15 text-primary-light" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                Maiores Arquivos ({scanResult.largest_files.length})
              </button>
            )}
          </div>
          {folderTree.length > 0 && (
            <p className="text-[12px] text-text-muted">
              Total analisado: <span className="font-mono font-semibold text-primary-light">{formatBytes(totalSize)}</span>
              {" "}em <span className="font-mono">{folderTree.length}</span> pastas
            </p>
          )}
        </div>
      )}

      {/* Árvore de pastas — WizTree style */}
      {activeView === "tree" && folderTree.length > 0 && (
        <div className="card-static overflow-hidden">
          {/* Header da tabela */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-bg-card text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
            <span style={{ paddingLeft: "68px" }} className="min-w-[180px] max-w-[300px]">Nome</span>
            <span className="flex-1 mx-4">Uso</span>
            <span className="w-14 text-right">%</span>
            <span className="w-24 text-right">Tamanho</span>
            <span className="w-16 text-right">Itens</span>
            <span className="w-6" />
          </div>

          {/* Loading */}
          {isLoadingPath === selectedDisk && folderTree.length === 0 && (
            <div className="flex items-center justify-center py-16 gap-3">
              <svg className="animate-spin w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] text-text-muted">Calculando tamanhos das pastas...</span>
            </div>
          )}

          {/* Árvore */}
          <div className="max-h-[600px] overflow-y-auto">
            <FolderTree nodes={folderTree} parentSize={totalSize} depth={0} />
          </div>
        </div>
      )}

      {/* Scan completo — maiores arquivos */}
      {activeView === "stats" && scanResult && (
        <div className="space-y-5">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="card-static p-5 text-center">
              <p className="text-[28px] font-extrabold text-primary-light">{formatBytes(scanResult.job.total_size)}</p>
              <p className="text-[11px] text-text-muted mt-2">Tamanho Total</p>
            </div>
            <div className="card-static p-5 text-center">
              <p className="text-[28px] font-extrabold text-info">{scanResult.job.total_files.toLocaleString()}</p>
              <p className="text-[11px] text-text-muted mt-2">Arquivos</p>
            </div>
            <div className="card-static p-5 text-center">
              <p className="text-[28px] font-extrabold text-warning">{scanResult.job.total_dirs.toLocaleString()}</p>
              <p className="text-[11px] text-text-muted mt-2">Diretórios</p>
            </div>
            <div className="card-static p-5 text-center">
              <p className="text-[28px] font-extrabold text-text-primary">
                {scanResult.job.finished_at && scanResult.job.started_at
                  ? `${((scanResult.job.finished_at - scanResult.job.started_at) / 1000).toFixed(1)}s`
                  : "—"}
              </p>
              <p className="text-[11px] text-text-muted mt-2">Tempo de Scan</p>
            </div>
          </div>

          {/* Maiores arquivos */}
          <div className="card-static overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
                Top 100 Maiores Arquivos
              </h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {scanResult.largest_files.map((file, i) => (
                <div
                  key={file.path}
                  className="flex items-center gap-3 px-5 py-3 border-b border-border/30 hover:bg-bg-card-hover transition-colors"
                >
                  <span className="text-[11px] text-text-muted font-mono w-8 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="w-7 h-7 rounded-md bg-bg-elevated flex items-center justify-center flex-shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-text-primary font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-text-muted truncate">{file.path}</p>
                  </div>
                  <span className="text-[11px] text-text-muted font-mono uppercase flex-shrink-0">
                    {file.extension || "—"}
                  </span>
                  <span className="text-[14px] font-mono font-bold text-primary-light w-28 text-right flex-shrink-0">
                    {formatBytes(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {folderTree.length === 0 && !isLoadingPath && !error && (
        <div className="card-static p-16 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-text-muted mx-auto mb-5">
            <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
          </svg>
          <p className="text-[15px] text-text-secondary font-medium">Selecione um disco acima para começar</p>
          <p className="text-[12px] text-text-muted mt-2">A análise mostrará todas as pastas ordenadas por tamanho</p>
        </div>
      )}
    </div>
  );
}
