/// Maiores Arquivos — ranking premium

import { useScanResult } from "../stores/diskStore";
import { useHistoryActions } from "../stores/historyStore";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { DataTable, type Column } from "../components/ui/DataTable";
import { formatBytes, formatTimestamp, truncate, formatExtension } from "../utils/format";
import { openInExplorer, deleteToTrash } from "../services/tauri-commands";
import type { FileItem } from "../types";

const PageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
  </svg>
);

const FolderIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const TrashIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export function LargestFiles() {
  const scanResult = useScanResult();
  const { addAction, addLog } = useHistoryActions();
  const files = scanResult?.largest_files ?? [];

  const handleOpenLocation = async (path: string) => {
    try {
      await openInExplorer(path);
      addLog("Info", `Abriu localização: ${path}`);
    } catch (error) {
      addLog("Error", `Erro ao abrir: ${error}`);
    }
  };

  const handleDelete = async (file: FileItem) => {
    const confirmed = window.confirm(`Mover para a lixeira?\n\n${file.name}\n${formatBytes(file.size)}`);
    if (!confirmed) return;
    try {
      const action = await deleteToTrash(file.path);
      addAction(action);
      addLog("Info", `Movido para lixeira: ${file.name}`);
    } catch (error) {
      addLog("Error", `Erro: ${error}`);
    }
  };

  const columns: Column<FileItem>[] = [
    {
      key: "name",
      label: "Arquivo",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-text-primary text-[13px] font-medium truncate">{truncate(item.name, 40)}</p>
            <p className="text-text-muted text-[10px] truncate">{truncate(item.path, 60)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "size",
      label: "Tamanho",
      sortable: true,
      align: "right",
      width: "120px",
      render: (item) => <span className="font-mono text-primary-light font-bold text-[13px]">{formatBytes(item.size)}</span>,
    },
    {
      key: "extension",
      label: "Tipo",
      sortable: true,
      width: "100px",
      render: (item) => (
        <span className="text-[11px] text-text-muted bg-bg-elevated px-2 py-0.5 rounded font-mono">
          {formatExtension(item.extension)}
        </span>
      ),
    },
    {
      key: "modified_at",
      label: "Modificado",
      sortable: true,
      width: "150px",
      render: (item) => <span className="text-text-muted text-[12px]">{formatTimestamp(item.modified_at)}</span>,
    },
    {
      key: "actions",
      label: "",
      width: "90px",
      render: (item) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => handleOpenLocation(item.path)} icon={FolderIcon} />
          <Button size="sm" variant="ghost" onClick={() => handleDelete(item)} icon={TrashIcon} />
        </div>
      ),
    },
  ];

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader title="Maiores Arquivos" subtitle="Ranking dos arquivos que mais consomem espaço" icon={PageIcon} />

      {files.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="card-static p-4 text-center">
              <p className="text-[24px] font-extrabold text-primary-light">{files.length}</p>
              <p className="text-[11px] text-text-muted mt-1">Arquivos listados</p>
            </div>
            <div className="card-static p-4 text-center">
              <p className="text-[24px] font-extrabold text-info">{formatBytes(totalSize)}</p>
              <p className="text-[11px] text-text-muted mt-1">Tamanho total</p>
            </div>
            <div className="card-static p-4 text-center">
              <p className="text-[24px] font-extrabold text-warning">{files.filter(f => f.is_temp).length}</p>
              <p className="text-[11px] text-text-muted mt-1">Temporários</p>
            </div>
            <div className="card-static p-4 text-center">
              <p className="text-[24px] font-extrabold text-danger">{files.filter(f => f.is_old).length}</p>
              <p className="text-[11px] text-text-muted mt-1">Antigos (+90 dias)</p>
            </div>
          </div>
          <DataTable columns={columns} data={files} keyExtractor={(item) => item.path} maxHeight="600px" />
        </>
      ) : (
        <div className="card-static p-12 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted mx-auto mb-4">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <p className="text-text-muted text-[14px]">Execute um scan de disco primeiro</p>
        </div>
      )}
    </div>
  );
}
