/// Gráfico de RAM em tempo real — usa config compartilhada

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatTime } from "../../utils/format";
import { chartColors, tooltipStyle, gridProps, xAxisProps, yAxisProps } from "./chartConfig";

interface RamChartProps {
  data: Array<{ timestamp: number; ram: number }>;
}

export function RamChart({ data }: RamChartProps) {
  const chartData = data.map((d) => ({
    time: formatTime(d.timestamp),
    ram: Number(d.ram.toFixed(1)),
  }));

  return (
    <div className="card-static p-5">
      <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-4">
        Memória RAM em Tempo Real
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.ram} stopOpacity={0.2} />
              <stop offset="95%" stopColor={chartColors.ram} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="time" {...xAxisProps} />
          <YAxis domain={[0, 100]} unit="%" {...yAxisProps} />
          <Tooltip
            {...tooltipStyle}
            itemStyle={{ color: chartColors.ram }}
          />
          <Area
            type="monotone"
            dataKey="ram"
            stroke={chartColors.ram}
            fill="url(#ramGradient)"
            strokeWidth={2}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
