/// Treemap visual de uso de disco (estilo WinDirStat) — premium

import { useMemo } from "react";
import { formatBytes } from "../../utils/format";
import type { DirectoryNode } from "../../types";

interface TreemapProps {
  data: DirectoryNode;
  width?: number;
  height?: number;
  onNodeClick?: (node: DirectoryNode) => void;
}

interface TreemapRect {
  x: number;
  y: number;
  w: number;
  h: number;
  node: DirectoryNode;
  color: string;
}

// Cores mais sofisticadas e dessaturadas
const COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4",
  "#ef4444", "#eab308", "#78716c", "#64748b", "#ec4899",
  "#6366f1", "#14b8a6", "#f97316", "#a78bfa", "#84cc16",
];

function getColor(index: number, depth: number): string {
  const base = COLORS[index % COLORS.length];
  const factor = Math.max(0.5, 1 - depth * 0.15);
  return adjustBrightness(base, factor);
}

function adjustBrightness(hex: string, factor: number): string {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

// Algoritmo squarified treemap
function squarify(
  children: DirectoryNode[],
  x: number,
  y: number,
  w: number,
  h: number,
  depth: number
): TreemapRect[] {
  if (children.length === 0 || w <= 0 || h <= 0) return [];

  const totalSize = children.reduce((sum, c) => sum + c.size, 0);
  if (totalSize === 0) return [];

  const rects: TreemapRect[] = [];
  let currentX = x;
  let currentY = y;
  let remainingW = w;
  let remainingH = h;

  const sorted = [...children].sort((a, b) => b.size - a.size);
  const isHorizontal = remainingW >= remainingH;

  for (let i = 0; i < sorted.length; i++) {
    const ratio = sorted[i].size / totalSize;

    let rectW: number, rectH: number;
    if (isHorizontal) {
      rectW = remainingW * ratio;
      rectH = remainingH;
    } else {
      rectW = remainingW;
      rectH = remainingH * ratio;
    }

    rects.push({
      x: currentX,
      y: currentY,
      w: Math.max(rectW, 0),
      h: Math.max(rectH, 0),
      node: sorted[i],
      color: getColor(i, depth),
    });

    if (isHorizontal) {
      currentX += rectW;
      remainingW -= rectW;
    } else {
      currentY += rectH;
      remainingH -= rectH;
    }
  }

  return rects;
}

export function Treemap({ data, width = 800, height = 500, onNodeClick }: TreemapProps) {
  const rects = useMemo(() => {
    const children = data.children.length > 0 ? data.children : [];
    return squarify(children, 0, 0, width, height, 0);
  }, [data, width, height]);

  return (
    <div className="card-static p-5">
      <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-4">
        Mapa Visual de Disco — {data.name}
      </h3>
      <div className="rounded-lg overflow-hidden bg-bg-app">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ maxHeight: `${height}px` }}
        >
          {rects.map((rect, i) => (
            <g
              key={i}
              className="cursor-pointer"
              onClick={() => onNodeClick?.(rect.node)}
            >
              <rect
                x={rect.x + 1}
                y={rect.y + 1}
                width={Math.max(rect.w - 2, 0)}
                height={Math.max(rect.h - 2, 0)}
                fill={rect.color}
                rx={3}
                opacity={0.75}
                className="hover:opacity-95 transition-opacity duration-200"
              />
              {rect.w > 60 && rect.h > 30 && (
                <>
                  <text
                    x={rect.x + rect.w / 2}
                    y={rect.y + rect.h / 2 - 6}
                    textAnchor="middle"
                    fill="white"
                    fontSize={Math.min(12, rect.w / 8)}
                    fontWeight="600"
                  >
                    {rect.node.name.length > rect.w / 8
                      ? rect.node.name.substring(0, Math.floor(rect.w / 8)) + "..."
                      : rect.node.name}
                  </text>
                  <text
                    x={rect.x + rect.w / 2}
                    y={rect.y + rect.h / 2 + 10}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.6)"
                    fontSize={Math.min(10, rect.w / 10)}
                  >
                    {formatBytes(rect.node.size)}
                  </text>
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
