/// Gráfico de CPU em tempo real — visual premium

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatTime } from "../../utils/format";

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
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "#71717a" }}
            axisLine={{ stroke: "#27272a" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#71717a" }}
            axisLine={false}
            tickLine={false}
            unit="%"
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "10px",
              fontSize: "12px",
              color: "#fafafa",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
            }}
            itemStyle={{ color: "#22c55e" }}
            labelStyle={{ color: "#a1a1aa", fontSize: "11px", marginBottom: "4px" }}
          />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#22c55e", stroke: "#0f0f12", strokeWidth: 2 }}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
