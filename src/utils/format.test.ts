/// Testes dos utilitários de formatação

import { describe, it, expect } from "vitest";
import {
  formatBytes,
  formatPercent,
  formatDuration,
  getUsageColor,
  getStatusLabel,
  getStatusClass,
  truncate,
  formatExtension,
  formatTime,
} from "./format";

describe("formatBytes", () => {
  it("formata 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formata bytes", () => {
    expect(formatBytes(500)).toBe("500 B");
  });

  it("formata kilobytes", () => {
    expect(formatBytes(1024)).toBe("1 KB");
  });

  it("formata megabytes", () => {
    expect(formatBytes(1048576)).toBe("1 MB");
  });

  it("formata gigabytes", () => {
    expect(formatBytes(1073741824)).toBe("1 GB");
  });

  it("formata terabytes", () => {
    expect(formatBytes(1099511627776)).toBe("1 TB");
  });

  it("respeita casas decimais", () => {
    expect(formatBytes(1536, 1)).toBe("1.5 KB");
  });

  it("formata valores grandes com precisão", () => {
    expect(formatBytes(349240000000, 2)).toBe("325.26 GB");
  });
});

describe("formatPercent", () => {
  it("formata com 1 casa decimal por padrão", () => {
    expect(formatPercent(73.456)).toBe("73.5%");
  });

  it("formata com 0 casas", () => {
    expect(formatPercent(99.9, 0)).toBe("100%");
  });

  it("formata zero", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });
});

describe("formatDuration", () => {
  it("formata minutos", () => {
    expect(formatDuration(300)).toBe("5m");
  });

  it("formata horas e minutos", () => {
    expect(formatDuration(3660)).toBe("1h 1m");
  });

  it("formata dias, horas e minutos", () => {
    expect(formatDuration(90000)).toBe("1d 1h 0m");
  });
});

describe("getUsageColor", () => {
  it("retorna verde para uso baixo", () => {
    expect(getUsageColor(30)).toBe("#4CAF50");
  });

  it("retorna amarelo para uso moderado", () => {
    expect(getUsageColor(60)).toBe("#FFC107");
  });

  it("retorna laranja para uso alto", () => {
    expect(getUsageColor(80)).toBe("#FF9800");
  });

  it("retorna vermelho para uso crítico", () => {
    expect(getUsageColor(95)).toBe("#F44336");
  });
});

describe("getStatusLabel", () => {
  it("retorna Normal para uso baixo", () => {
    expect(getStatusLabel(30)).toBe("Normal");
  });

  it("retorna Atenção para uso moderado", () => {
    expect(getStatusLabel(55)).toBe("Atenção");
  });

  it("retorna Alerta para uso alto", () => {
    expect(getStatusLabel(80)).toBe("Alerta");
  });

  it("retorna Crítico para uso extremo", () => {
    expect(getStatusLabel(95)).toBe("Crítico");
  });
});

describe("truncate", () => {
  it("não trunca strings curtas", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("trunca strings longas com reticências", () => {
    expect(truncate("hello world foo bar", 10)).toBe("hello w...");
  });
});

describe("formatExtension", () => {
  it("formata extensão sem ponto", () => {
    expect(formatExtension("pdf")).toBe(".PDF");
  });

  it("formata extensão com ponto", () => {
    expect(formatExtension(".pdf")).toBe(".PDF");
  });

  it("retorna placeholder para vazio", () => {
    expect(formatExtension("")).toBe("Sem extensão");
  });
});
