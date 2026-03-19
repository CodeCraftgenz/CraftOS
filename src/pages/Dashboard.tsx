/// Dashboard principal — visão geral do sistema em tempo real

import { useEffect } from "react";
import { useMetrics, useResourceHistory, useSystemActions } from "../stores/systemStore";
import { MetricCard } from "../components/ui/MetricCard";
import { ProgressBar } from "../components/ui/ProgressBar";
import { PageHeader } from "../components/ui/PageHeader";
import { CpuChart } from "../components/charts/CpuChart";
import { RamChart } from "../components/charts/RamChart";
import { DiskUsageChart } from "../components/charts/DiskUsageChart";
import { formatBytes, formatPercent, formatDuration, getUsageColor } from "../utils/format";

// Ícones SVG
const CpuIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

const RamIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 19v-8a6 6 0 0 1 12 0v8" /><rect x="2" y="19" width="20" height="3" rx="1" />
    <line x1="9" y1="19" x2="9" y2="13" /><line x1="15" y1="19" x2="15" y2="13" />
  </svg>
);

const UptimeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const DiskIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const DashIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export function Dashboard() {
  const metrics = useMetrics();
  const history = useResourceHistory();
  const { startMonitoring, stopMonitoring, fetchHistory } = useSystemActions();

  useEffect(() => {
    startMonitoring(2000);
    fetchHistory(60);
    const historyInterval = setInterval(() => fetchHistory(60), 10000);
    return () => {
      stopMonitoring();
      clearInterval(historyInterval);
    };
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-4">
          <svg className="animate-spin w-8 h-8 text-primary mx-auto" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="text-text-muted text-[13px]">Coletando métricas do sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle={`${metrics.hostname} — ${metrics.os_name} ${metrics.os_version}`}
        icon={DashIcon}
      />

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          title="CPU"
          value={formatPercent(metrics.cpu_usage)}
          subtitle={`${metrics.cpu_count} cores`}
          percent={metrics.cpu_usage}
          icon={CpuIcon}
        />
        <MetricCard
          title="Memória RAM"
          value={formatBytes(metrics.ram_used)}
          subtitle={`de ${formatBytes(metrics.ram_total)}`}
          percent={metrics.ram_percent}
          icon={RamIcon}
        />
        <MetricCard
          title="Uptime"
          value={formatDuration(metrics.uptime)}
          icon={UptimeIcon}
        />
        <MetricCard
          title="Discos"
          value={`${metrics.disks.length} unidade${metrics.disks.length > 1 ? "s" : ""}`}
          icon={DiskIcon}
        />
      </div>

      {/* Gráficos em tempo real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CpuChart data={history.length > 0 ? history : [{ timestamp: Date.now(), cpu: metrics.cpu_usage }]} />
        <RamChart data={history.length > 0 ? history : [{ timestamp: Date.now(), ram: metrics.ram_percent }]} />
      </div>

      {/* Uso de disco */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DiskUsageChart disks={metrics.disks} />

        <div className="card-static p-5">
          <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-4">
            Detalhes dos Discos
          </h3>
          <div className="space-y-3">
            {metrics.disks.map((disk, i) => (
              <div key={i} className="p-3.5 bg-bg-app/50 rounded-xl border border-border/50">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-bg-elevated flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold text-text-primary">
                        {disk.mount_point || disk.name}
                      </span>
                      <span className="text-[11px] text-text-muted ml-2">{disk.fs_type}</span>
                    </div>
                  </div>
                  <span
                    className="text-[13px] font-mono font-bold"
                    style={{ color: getUsageColor(disk.usage_percent) }}
                  >
                    {formatPercent(disk.usage_percent)}
                  </span>
                </div>
                <ProgressBar percent={disk.usage_percent} height={5} />
                <div className="flex justify-between mt-2">
                  <span className="text-[11px] text-text-muted">
                    Usado: {formatBytes(disk.used_space)}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Livre: {formatBytes(disk.available_space)}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Total: {formatBytes(disk.total_space)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CPU por core */}
      {metrics.cpu_per_core.length > 0 && (
        <div className="card-static p-5">
          <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-4">
            Utilização por Core
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {metrics.cpu_per_core.map((usage, i) => (
              <div key={i} className="p-2.5 bg-bg-app/50 rounded-xl border border-border/50 text-center">
                <p className="text-[10px] text-text-muted mb-1.5">Core {i}</p>
                <p className="text-[14px] font-mono font-bold mb-1.5" style={{ color: getUsageColor(usage) }}>
                  {usage.toFixed(0)}%
                </p>
                <ProgressBar percent={usage} height={3} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
