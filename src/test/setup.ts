/// Setup global para testes

import "@testing-library/jest-dom/vitest";

// Mock do @tauri-apps/api/core para testes sem o runtime Tauri
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

// Mock do localStorage para stores com persist
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });
