/// Gráfico de RAM em tempo real — área chart premium

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatTime } from "../../utils/format";

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
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            itemStyle={{ color: "#3b82f6" }}
            labelStyle={{ color: "#a1a1aa", fontSize: "11px", marginBottom: "4px" }}
          />
          <Area
            type="monotone"
            dataKey="ram"
            stroke="#3b82f6"
            fill="url(#ramGradient)"
            strokeWidth={2}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
