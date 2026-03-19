/// Testes do historyStore

import { describe, it, expect, beforeEach } from "vitest";
import { useHistoryStore } from "./historyStore";

describe("historyStore", () => {
  beforeEach(() => {
    useHistoryStore.setState({ actions: [], logs: [] });
  });

  it("adiciona log corretamente", () => {
    useHistoryStore.getState().addLog("Info", "Teste de log");

    const logs = useHistoryStore.getState().logs;
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe("Info");
    expect(logs[0].message).toBe("Teste de log");
    expect(logs[0].id).toBeDefined();
    expect(logs[0].timestamp).toBeGreaterThan(0);
  });

  it("adiciona action corretamente", () => {
    useHistoryStore.getState().addAction({
      id: "test-1",
      action_type: "MoveToTrash",
      target_path: "C:\\test.txt",
      size_freed: 1024,
      timestamp: Date.now(),
      status: "Completed",
      error_message: null,
    });

    const actions = useHistoryStore.getState().actions;
    expect(actions).toHaveLength(1);
    expect(actions[0].id).toBe("test-1");
    expect(actions[0].size_freed).toBe(1024);
  });

  it("limita logs a 1000", () => {
    for (let i = 0; i < 1010; i++) {
      useHistoryStore.getState().addLog("Info", `Log ${i}`);
    }
    expect(useHistoryStore.getState().logs.length).toBeLessThanOrEqual(1000);
  });

  it("limita actions a 500", () => {
    for (let i = 0; i < 510; i++) {
      useHistoryStore.getState().addAction({
        id: `action-${i}`,
        action_type: "Delete",
        target_path: `C:\\file${i}.txt`,
        size_freed: 100,
        timestamp: Date.now(),
        status: "Completed",
        error_message: null,
      });
    }
    expect(useHistoryStore.getState().actions.length).toBeLessThanOrEqual(500);
  });

  it("clearActions limpa todas as ações", () => {
    useHistoryStore.getState().addAction({
      id: "test", action_type: "Delete", target_path: "x", size_freed: 0,
      timestamp: 0, status: "Completed", error_message: null,
    });
    useHistoryStore.getState().clearActions();
    expect(useHistoryStore.getState().actions).toEqual([]);
  });

  it("clearLogs limpa todos os logs", () => {
    useHistoryStore.getState().addLog("Error", "Teste");
    useHistoryStore.getState().clearLogs();
    expect(useHistoryStore.getState().logs).toEqual([]);
  });
});
