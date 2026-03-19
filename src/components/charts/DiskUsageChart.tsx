/// Gráfico de uso de disco — usa config compartilhada

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatBytes, getUsageColor } from "../../utils/format";
import { chartColors, tooltipStyle } from "./chartConfig";
import type { DiskInfo } from "../../types";

interface DiskUsageChartProps {
  disks: DiskInfo[];
}

export function DiskUsageChart({ disks }: DiskUsageChartProps) {
  const chartData = disks.map((d) => ({
    name: d.mount_point || d.name,
    usado: d.used_space,
    livre: d.available_space,
    percent: d.usage_percent,
  }));

  return (
    <div className="card-static p-5">
      <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-4">
        Uso por Disco
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(120, disks.length * 50)}>
        <BarChart data={chartData} layout="vertical" barSize={16}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: chartColors.axis }}
            tickFormatter={(v: number) => formatBytes(v)}
            axisLine={{ stroke: chartColors.grid }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: chartColors.text, fontWeight: 500 }}
            width={55}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number) => formatBytes(value)}
          />
          <Bar dataKey="usado" name="Usado" stackId="a" radius={[0, 0, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getUsageColor(entry.percent)} />
            ))}
          </Bar>
          <Bar dataKey="livre" name="Livre" stackId="a" fill={chartColors.grid} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
