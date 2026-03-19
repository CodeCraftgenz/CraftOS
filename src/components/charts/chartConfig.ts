/// Configuração compartilhada para todos os gráficos Recharts
/// Centraliza cores, estilos de tooltip, grid e eixos

export const chartColors = {
  cpu: "#22c55e",
  ram: "#3b82f6",
  disk: "#f59e0b",
  grid: "#27272a",
  axis: "#71717a",
  text: "#a1a1aa",
  background: "#18181b",
  border: "#27272a",
} as const;

export const tooltipStyle = {
  contentStyle: {
    backgroundColor: chartColors.background,
    border: `1px solid ${chartColors.border}`,
    borderRadius: "10px",
    fontSize: "12px",
    color: "#fafafa",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
    padding: "8px 12px",
  },
  labelStyle: {
    color: chartColors.text,
    fontSize: "11px",
    marginBottom: "4px",
  },
} as const;

export const gridProps = {
  strokeDasharray: "3 3",
  stroke: chartColors.grid,
  vertical: false,
} as const;

export const xAxisProps = {
  tick: { fontSize: 10, fill: chartColors.axis },
  axisLine: { stroke: chartColors.grid },
  tickLine: false as const,
};

export const yAxisProps = {
  tick: { fontSize: 10, fill: chartColors.axis },
  axisLine: false as const,
  tickLine: false as const,
  width: 40,
};

/** Estilo do active dot nos gráficos de linha */
export const activeDotStyle = (color: string) => ({
  r: 4,
  fill: color,
  stroke: "#0f0f12",
  strokeWidth: 2,
});

/** Gera props de gradiente para AreaChart */
export const areaGradientId = (id: string) => `gradient-${id}`;
