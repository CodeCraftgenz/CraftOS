/// Tabela de dados com sorting e visual premium

import { useState, useMemo } from "react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  maxHeight?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "Nenhum dado encontrado",
  maxHeight = "500px",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  if (data.length === 0) {
    return (
      <div className="card-static p-10 text-center">
        <p className="text-text-muted text-[13px]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="card-static overflow-hidden">
      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] bg-bg-card sticky top-0 z-10
                    ${col.sortable ? "cursor-pointer select-none hover:text-text-secondary" : ""}
                    text-${col.align || "left"}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1.5 ${col.align === "right" ? "justify-end" : ""}`}>
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary-light">
                        {sortDir === "asc"
                          ? <polyline points="18 15 12 9 6 15" />
                          : <polyline points="6 9 12 15 18 9" />}
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={`border-b border-border/40 transition-colors duration-100
                  ${onRowClick ? "cursor-pointer" : ""}
                  hover:bg-bg-card-hover`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-[13px] text-${col.align || "left"}`}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
