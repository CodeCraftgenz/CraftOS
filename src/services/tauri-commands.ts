/// Serviço de comunicação com o backend Tauri

import { invoke } from "@tauri-apps/api/core";
import type {
  SystemMetrics,
  ResourceHistory,
  ScanResult,
  DirectoryNode,
  CleanupAction,
  CleanupSuggestion,
  UserSettings,
} from "../types";

// ==========================================
// SISTEMA
// ==========================================

export async function getSystemMetrics(): Promise<SystemMetrics> {
  return invoke<SystemMetrics>("get_system_metrics");
}

export async function getResourceHistory(limit: number): Promise<ResourceHistory[]> {
  return invoke<ResourceHistory[]>("get_resource_history", { limit });
}

// ==========================================
// SCAN DE DISCO (WIZTREE STYLE)
// ==========================================

/** Scan de pastas com tamanho recursivo — estilo WizTree */
export async function scanFolderSizes(rootPath: string, depth?: number): Promise<DirectoryNode[]> {
  return invoke<DirectoryNode[]>("scan_folder_sizes", { rootPath, depth });
}

/** Scan completo rápido (passada única) para estatísticas e maiores arquivos */
export async function fastScan(rootPath: string, maxDepth?: number): Promise<ScanResult> {
  return invoke<ScanResult>("fast_scan", { rootPath, maxDepth });
}

/** Scan rápido de primeiro nível */
export async function quickScan(path: string): Promise<DirectoryNode[]> {
  return invoke<DirectoryNode[]>("quick_scan", { path });
}

// ==========================================
// AÇÕES EM ARQUIVOS
// ==========================================

export async function deleteToTrash(path: string): Promise<CleanupAction> {
  return invoke<CleanupAction>("delete_to_trash", { path });
}

export async function deletePermanent(path: string): Promise<CleanupAction> {
  return invoke<CleanupAction>("delete_permanent", { path });
}

export async function moveFile(source: string, destination: string): Promise<CleanupAction> {
  return invoke<CleanupAction>("move_file", { source, destination });
}

export async function cleanTempDirectory(path: string): Promise<CleanupAction> {
  return invoke<CleanupAction>("clean_temp_directory", { path });
}

export async function openInExplorer(path: string): Promise<void> {
  return invoke<void>("open_in_explorer", { path });
}

// ==========================================
// CONFIGURAÇÕES
// ==========================================

export async function getDefaultSettings(): Promise<UserSettings> {
  return invoke<UserSettings>("get_default_settings");
}

// ==========================================
// LIMPEZA
// ==========================================

export async function getCleanupSuggestions(): Promise<CleanupSuggestion[]> {
  return invoke<CleanupSuggestion[]>("get_cleanup_suggestions");
}
