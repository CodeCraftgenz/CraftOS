/// Barra de progresso com animação suave

import { getUsageColor } from "../../utils/format";

interface ProgressBarProps {
  percent: number;
  height?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
  animate?: boolean;
}

export function ProgressBar({
  percent,
  height = 6,
  showLabel = false,
  label,
  className = "",
  animate = true,
}: ProgressBarProps) {
  const color = getUsageColor(percent);

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] text-text-secondary font-medium">{label}</span>
          <span className="text-[11px] font-mono font-semibold" style={{ color }}>
            {percent.toFixed(1)}%
          </span>
        </div>
      )}
      <div
        className="w-full bg-bg-app/60 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full rounded-full ${animate ? "transition-all duration-700 ease-out" : ""}`}
          style={{
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: color,
            boxShadow: percent > 75 ? `0 0 10px ${color}30` : undefined,
          }}
        />
      </div>
    </div>
  );
}
