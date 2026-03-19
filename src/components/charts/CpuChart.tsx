/// Gráfico de CPU em tempo real — usa config compartilhada

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatTime } from "../../utils/format";
import { chartColors, tooltipStyle, gridProps, xAxisProps, yAxisProps, activeDotStyle } from "./chartConfig";

interface CpuChartProps {
  data: Array<{ timestamp: number; cpu: number }>;
}

export function CpuChart({ data }: CpuChartProps) {
  const chartData = data.map((d) => ({
    time: formatTime(d.timestamp),
    cpu: Number(d.cpu.toFixed(1)),
  }));

  return (
    <div className="card-static p-5">
      <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-4">
        CPU em Tempo Real
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey="time" {...xAxisProps} />
          <YAxis domain={[0, 100]} unit="%" {...yAxisProps} />
          <Tooltip
            {...tooltipStyle}
            itemStyle={{ color: chartColors.cpu }}
          />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke={chartColors.cpu}
            strokeWidth={2}
            dot={false}
            activeDot={activeDotStyle(chartColors.cpu)}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
