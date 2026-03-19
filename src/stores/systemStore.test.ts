/// Testes do systemStore

import { describe, it, expect, vi, beforeEach } from "vitest";
import { invoke } from "@tauri-apps/api/core";
import { useSystemStore } from "./systemStore";
import type { SystemMetrics } from "../types";

const mockMetrics: SystemMetrics = {
  timestamp: Date.now(),
  cpu_usage: 25.5,
  cpu_count: 8,
  cpu_per_core: [20, 30, 15, 40, 10, 25, 35, 20],
  ram_used: 8589934592,
  ram_total: 17179869184,
  ram_percent: 50.0,
  disks: [
    {
      name: "C:",
      mount_point: "C:\\",
      total_space: 500000000000,
      used_space: 350000000000,
      available_space: 150000000000,
      fs_type: "NTFS",
      usage_percent: 70.0,
    },
  ],
  hostname: "TEST-PC",
  os_name: "Windows",
  os_version: "11",
  uptime: 86400,
};

describe("systemStore", () => {
  beforeEach(() => {
    // Reseta o store entre testes
    useSystemStore.setState({
      metrics: null,
      history: [],
      error: null,
      _intervalId: null,
    });
    vi.clearAllMocks();
  });

  it("começa com estado inicial correto", () => {
    const state = useSystemStore.getState();
    expect(state.metrics).toBeNull();
    expect(state.history).toEqual([]);
    expect(state.error).toBeNull();
  });

  it("fetchMetrics atualiza as métricas", async () => {
    vi.mocked(invoke).mockResolvedValueOnce(mockMetrics);

    await useSystemStore.getState().fetchMetrics();

    const state = useSystemStore.getState();
    expect(state.metrics).toEqual(mockMetrics);
    expect(state.error).toBeNull();
  });

  it("fetchMetrics captura erros", async () => {
    vi.mocked(invoke).mockRejectedValueOnce(new Error("Falha na conexão"));

    await useSystemStore.getState().fetchMetrics();

    const state = useSystemStore.getState();
    expect(state.metrics).toBeNull();
    expect(state.error).toContain("Falha na conexão");
  });

  it("fetchHistory atualiza o histórico", async () => {
    const mockHistory = [
      { id: "1", timestamp: Date.now(), cpu: 25.0, ram: 50.0, disk_read: 0, disk_write: 0 },
    ];
    vi.mocked(invoke).mockResolvedValueOnce(mockHistory);

    await useSystemStore.getState().fetchHistory(10);

    expect(useSystemStore.getState().history).toEqual(mockHistory);
  });
});
