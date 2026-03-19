/// Store de análise de disco — com selectors granulares

import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import type { ScanResult, DirectoryNode } from "../types";
import { scanFolderSizes, fastScan } from "../services/tauri-commands";

interface DiskState {
  folderTree: DirectoryNode[];
  expandedPaths: Set<string>;
  childrenCache: Record<string, DirectoryNode[]>;
  isLoadingPath: string | null;

  scanResult: ScanResult | null;
  isScanning: boolean;
  error: string | null;
  selectedDisk: string;

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
      newExpanded.delete(path);
      set({ expandedPaths: newExpanded });
    } else {
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

// ==========================================
// SELECTORS GRANULARES
// ==========================================

export const useFolderTree = () => useDiskStore((s) => s.folderTree);
export const useExpandedPaths = () => useDiskStore((s) => s.expandedPaths);
export const useChildrenCache = () => useDiskStore((s) => s.childrenCache);
export const useIsLoadingPath = () => useDiskStore((s) => s.isLoadingPath);
export const useScanResult = () => useDiskStore((s) => s.scanResult);
export const useIsScanning = () => useDiskStore((s) => s.isScanning);
export const useDiskError = () => useDiskStore((s) => s.error);
export const useSelectedDisk = () => useDiskStore((s) => s.selectedDisk);

export const useDiskActions = () =>
  useDiskStore(
    useShallow((s) => ({
      loadFolderSizes: s.loadFolderSizes,
      toggleExpand: s.toggleExpand,
      runFullScan: s.runFullScan,
      setSelectedDisk: s.setSelectedDisk,
      clearResults: s.clearResults,
    }))
  );
