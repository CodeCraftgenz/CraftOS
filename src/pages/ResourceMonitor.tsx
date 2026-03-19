/// Monitor de Recursos — gráficos em tempo real

import { useEffect } from "react";
import { useSystemStore } from "../stores/systemStore";
import { PageHeader } from "../components/ui/PageHeader";
import { CpuChart } from "../components/charts/CpuChart";
import { RamChart } from "../components/charts/RamChart";
import { ProgressBar } from "../components/ui/ProgressBar";
import { formatBytes, formatPercent, getUsageColor } from "../utils/format";

const PageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export function ResourceMonitor() {
  const { metrics, history, startMonitoring, stopMonitoring, fetchHistory } = useSystemStore();

  useEffect(() => {
    startMonitoring(1000);
    fetchHistory(120);
    const interval = setInterval(() => fetchHistory(120), 5000);
    return () => {
      stopMonitoring();
      clearInterval(interval);
    };
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Monitor de Recursos"
        subtitle="Acompanhamento em tempo real do uso de recursos"
        icon={PageIcon}
      />

      {/* Métricas atuais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-static p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">CPU Total</h3>
            <span className="text-[24px] font-extrabold" style={{ color: getUsageColor(metrics.cpu_usage) }}>
              {formatPercent(metrics.cpu_usage)}
            </span>
          </div>
          <ProgressBar percent={metrics.cpu_usage} height={8} />
          <p className="text-[11px] text-text-muted mt-2.5">{metrics.cpu_count} cores disponíveis</p>
        </div>

        <div className="card-static p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">Memória RAM</h3>
            <span className="text-[24px] font-extrabold" style={{ color: getUsageColor(metrics.ram_percent) }}>
              {formatPercent(metrics.ram_percent)}
            </span>
          </div>
          <ProgressBar percent={metrics.ram_percent} height={8} />
          <p className="text-[11px] text-text-muted mt-2.5">
            {formatBytes(metrics.ram_used)} / {formatBytes(metrics.ram_total)}
          </p>
        </div>

        <div className="card-static p-5">
          <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-3">Discos</h3>
          <div className="space-y-2.5">
            {metrics.disks.map((disk, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-text-primary font-medium">{disk.mount_point}</span>
                  <span className="text-[11px] font-mono font-semibold" style={{ color: getUsageColor(disk.usage_percent) }}>
                    {formatPercent(disk.usage_percent)}
                  </span>
                </div>
                <ProgressBar percent={disk.usage_percent} height={4} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CpuChart data={history} />
        <RamChart data={history} />
      </div>

      {/* CPU por core */}
      <div className="card-static p-5">
        <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-4">
          Utilização por Core
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2">
          {metrics.cpu_per_core.map((usage, i) => (
            <div key={i} className="text-center p-2.5 bg-bg-app/50 rounded-xl border border-border/50">
              <div
                className="w-full rounded-full mb-1.5 mx-auto transition-all duration-500"
                style={{
                  height: `${Math.max(usage * 0.6, 3)}px`,
                  maxHeight: "50px",
                  backgroundColor: getUsageColor(usage),
                }}
              />
              <p className="text-[10px] text-text-muted">C{i}</p>
              <p className="text-[12px] font-mono font-bold" style={{ color: getUsageColor(usage) }}>
                {usage.toFixed(0)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
