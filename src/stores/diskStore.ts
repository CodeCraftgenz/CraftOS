/// Store de análise de disco — estilo WizTree

import { create } from "zustand";
import type { ScanResult, DirectoryNode } from "../types";
import { scanFolderSizes, fastScan } from "../services/tauri-commands";

interface DiskState {
  // Árvore de pastas (WizTree style)
  folderTree: DirectoryNode[];
  expandedPaths: Set<string>;
  childrenCache: Record<string, DirectoryNode[]>;
  isLoadingPath: string | null;

  // Scan completo
  scanResult: ScanResult | null;
  isScanning: boolean;
  error: string | null;

  // Disco selecionado
  selectedDisk: string;

  // Ações
  loadFolderSizes: (path: string) => Promise<void>;
  toggleExpand: (path: string) => Promise<void>;
  runFullScan: (path: string, maxDepth?: number) => Promise<void>;
  setSelectedDisk: (disk: string) => void;
  clearResults: () => void;
}

export const useDiskStore = create<DiskState>((set, get) => ({
  folderTree: [],
  expandedPaths: new Set(),
  childrenCache: {},
  isLoadingPath: null,

  scanResult: null,
  isScanning: false,
  error: null,
  selectedDisk: "C:\\",

  loadFolderSizes: async (path: string) => {
    set({ isLoadingPath: path, error: null });
    try {
      const folders = await scanFolderSizes(path);
      set({ folderTree: folders, isLoadingPath: null });
    } catch (error) {
      set({ error: String(error), isLoadingPath: null });
    }
  },

  toggleExpand: async (path: string) => {
    const { expandedPaths, childrenCache } = get();
    const newExpanded = new Set(expandedPaths);

    if (newExpanded.has(path)) {
      // Colapsa
      newExpanded.delete(path);
      set({ expandedPaths: newExpanded });
    } else {
      // Expande — carrega filhos se necessário
      newExpanded.add(path);
      set({ expandedPaths: newExpanded });

      if (!childrenCache[path]) {
        set({ isLoadingPath: path });
        try {
          const children = await scanFolderSizes(path);
          set((state) => ({
            childrenCache: { ...state.childrenCache, [path]: children },
            isLoadingPath: null,
          }));
        } catch {
          set({ isLoadingPath: null });
        }
      }
    }
  },

  runFullScan: async (path: string, maxDepth?: number) => {
    set({ isScanning: true, error: null, scanResult: null });
    try {
      const result = await fastScan(path, maxDepth);
      set({ scanResult: result, isScanning: false });
    } catch (error) {
      set({ error: String(error), isScanning: false });
    }
  },

  setSelectedDisk: (disk: string) => set({ selectedDisk: disk }),

  clearResults: () =>
    set({
      folderTree: [],
      expandedPaths: new Set(),
      childrenCache: {},
      scanResult: null,
    }),
}));
