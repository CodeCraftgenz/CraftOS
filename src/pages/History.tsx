/// Histórico — log de ações e eventos

import { useHistoryStore } from "../stores/historyStore";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { DataTable, type Column } from "../components/ui/DataTable";
import { formatBytes, formatTimestamp, truncate } from "../utils/format";
import type { CleanupAction, AppLog } from "../types";
import { useState } from "react";

const PageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

export function History() {
  const { actions, logs, clearActions, clearLogs } = useHistoryStore();
  const [activeTab, setActiveTab] = useState<"actions" | "logs">("actions");

  const actionColumns: Column<CleanupAction>[] = [
    {
      key: "timestamp", label: "Data/Hora", sortable: true, width: "160px",
      render: (item) => <span className="text-text-muted text-[12px] font-mono">{formatTimestamp(item.timestamp)}</span>,
    },
    {
      key: "action_type", label: "Tipo", sortable: true, width: "120px",
      render: (item) => {
        const labels: Record<string, string> = {
          Delete: "Excluir", MoveToTrash: "Lixeira", Move: "Mover",
          Copy: "Copiar", CleanTemp: "Limpar Temp", CleanDownloads: "Limpar Downloads",
        };
        return <span className="text-[12px] font-medium">{labels[item.action_type] || item.action_type}</span>;
      },
    },
    {
      key: "target_path", label: "Caminho",
      render: (item) => <span className="text-text-primary text-[13px]">{truncate(item.target_path, 50)}</span>,
    },
    {
      key: "size_freed", label: "Liberado", sortable: true, align: "right", width: "100px",
      render: (item) => <span className="font-mono text-primary-light text-[13px] font-semibold">{formatBytes(item.size_freed)}</span>,
    },
    {
      key: "status", label: "Status", width: "100px",
      render: (item) => {
        const styles: Record<string, string> = {
          Completed: "text-success bg-success/10 border-success/20",
          Failed: "text-danger bg-danger/10 border-danger/20",
          Reverted: "text-warning bg-warning/10 border-warning/20",
          Pending: "text-text-muted bg-bg-elevated border-border",
        };
        const labels: Record<string, string> = { Completed: "Concluído", Failed: "Falha", Reverted: "Revertido", Pending: "Pendente" };
        return <span className={`badge border ${styles[item.status] || ""}`}>{labels[item.status] || item.status}</span>;
      },
    },
  ];

  const logColumns: Column<AppLog>[] = [
    {
      key: "timestamp", label: "Data/Hora", sortable: true, width: "160px",
      render: (item) => <span className="text-text-muted text-[12px] font-mono">{formatTimestamp(item.timestamp)}</span>,
    },
    {
      key: "level", label: "Nível", width: "80px",
      render: (item) => {
        const styles: Record<string, string> = {
          Info: "text-info bg-info/10 border-info/20",
          Warning: "text-warning bg-warning/10 border-warning/20",
          Error: "text-danger bg-danger/10 border-danger/20",
          Debug: "text-text-muted bg-bg-elevated border-border",
        };
        return <span className={`badge border ${styles[item.level] || ""}`}>{item.level}</span>;
      },
    },
    {
      key: "message", label: "Mensagem",
      render: (item) => <span className="text-text-primary text-[13px]">{item.message}</span>,
    },
  ];

  const totalFreed = actions.reduce((sum, a) => sum + a.size_freed, 0);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader title="Histórico" subtitle="Registro de ações e eventos do sistema" icon={PageIcon} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-static p-4 text-center">
          <p className="text-[24px] font-extrabold text-primary-light">{actions.length}</p>
          <p className="text-[11px] text-text-muted mt-1">Ações realizadas</p>
        </div>
        <div className="card-static p-4 text-center">
          <p className="text-[24px] font-extrabold text-info">{formatBytes(totalFreed)}</p>
          <p className="text-[11px] text-text-muted mt-1">Total liberado</p>
        </div>
        <div className="card-static p-4 text-center">
          <p className="text-[24px] font-extrabold text-warning">{logs.length}</p>
          <p className="text-[11px] text-text-muted mt-1">Registros de log</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-bg-card rounded-xl">
          <button onClick={() => setActiveTab("actions")}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "actions" ? "bg-primary/15 text-primary-light" : "text-text-muted hover:text-text-secondary"}`}>
            Ações ({actions.length})
          </button>
          <button onClick={() => setActiveTab("logs")}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "logs" ? "bg-primary/15 text-primary-light" : "text-text-muted hover:text-text-secondary"}`}>
            Logs ({logs.length})
          </button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => activeTab === "actions" ? clearActions() : clearLogs()}>
          Limpar {activeTab === "actions" ? "ações" : "logs"}
        </Button>
      </div>

      {activeTab === "actions" ? (
        <DataTable columns={actionColumns} data={actions} keyExtractor={(item) => item.id} emptyMessage="Nenhuma ação registrada" maxHeight="500px" />
      ) : (
        <DataTable columns={logColumns} data={logs} keyExtractor={(item) => item.id} emptyMessage="Nenhum log registrado" maxHeight="500px" />
      )}
    </div>
  );
}
