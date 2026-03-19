/// Card de métrica com indicador visual premium

import { getUsageColor, getStatusLabel } from "../../utils/format";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  percent?: number;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, subtitle, percent, icon }: MetricCardProps) {
  const color = percent !== undefined ? getUsageColor(percent) : "#10b981";
  const status = percent !== undefined ? getStatusLabel(percent) : null;

  const gradientClass =
    percent !== undefined
      ? percent >= 90 ? "gradient-danger"
        : percent >= 75 ? "gradient-warning"
        : percent >= 50 ? "gradient-info"
        : "gradient-success"
      : "";

  return (
    <div className={`card ${gradientClass} p-5 animate-fade-in`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-bg-elevated/80 flex items-center justify-center text-text-muted">
              {icon}
            </div>
          )}
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
            {title}
          </span>
        </div>
        {status && (
          <span
            className="badge"
            style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}
          >
            {status}
          </span>
        )}
      </div>

      <p className="text-[28px] font-extrabold text-text-primary leading-none tracking-tight">
        {value}
      </p>
      {subtitle && (
        <p className="text-[12px] text-text-muted mt-1.5">{subtitle}</p>
      )}

      {percent !== undefined && (
        <div className="mt-4">
          <div className="w-full h-[5px] bg-bg-app/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.min(percent, 100)}%`,
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}40`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
