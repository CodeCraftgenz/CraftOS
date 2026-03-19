/// Tipos do TracOS — espelho das entidades Rust

export interface DiskInfo {
  name: string;
  mount_point: string;
  total_space: number;
  used_space: number;
  available_space: number;
  fs_type: string;
  usage_percent: number;
}

export interface SystemMetrics {
  timestamp: number;
  cpu_usage: number;
  cpu_count: number;
  cpu_per_core: number[];
  ram_used: number;
  ram_total: number;
  ram_percent: number;
  disks: DiskInfo[];
  hostname: string;
  os_name: string;
  os_version: string;
  uptime: number;
}

export type ScanStatus = "Pending" | "Running" | "Completed" | "Cancelled" | "Error";

export interface ScanJob {
  id: string;
  root_path: string;
  status: ScanStatus;
  started_at: number | null;
  finished_at: number | null;
  total_size: number;
  total_files: number;
  total_dirs: number;
  progress_percent: number;
  current_path: string;
}

export interface FileItem {
  path: string;
  name: string;
  size: number;
  extension: string;
  modified_at: number;
  is_temp: boolean;
  is_old: boolean;
  is_hidden: boolean;
}

export interface DirectoryNode {
  path: string;
  name: string;
  size: number;
  children_count: number;
  depth: number;
  parent_path: string | null;
  children: DirectoryNode[];
  files: FileItem[];
}

export interface TreemapNode {
  name: string;
  path: string;
  size: number;
  children: TreemapNode[];
  color?: string;
}

export interface ResourceHistory {
  id: string;
  timestamp: number;
  cpu: number;
  ram: number;
  disk_read: number;
  disk_write: number;
}

export type ActionType = "Delete" | "MoveToTrash" | "Move" | "Copy" | "CleanTemp" | "CleanDownloads";
export type ActionStatus = "Pending" | "Completed" | "Failed" | "Reverted";

export interface CleanupAction {
  id: string;
  action_type: ActionType;
  target_path: string;
  size_freed: number;
  timestamp: number;
  status: ActionStatus;
  error_message: string | null;
}

export interface CleanupSuggestion {
  category: string;
  description: string;
  paths: string[];
  total_size: number;
  risk_level: string;
}

export interface ScanResult {
  job: ScanJob;
  root: DirectoryNode;
  largest_files: FileItem[];
  largest_dirs: DirectoryNode[];
  suggestions: CleanupSuggestion[];
}

export interface UserSettings {
  update_interval: number;
  ignored_paths: string[];
  safe_mode: boolean;
  theme: string;
  size_unit: string;
  auto_cleanup: boolean;
  max_history_days: number;
}

export type LogLevel = "Info" | "Warning" | "Error" | "Debug";

export interface AppLog {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  context: string | null;
}

export interface ScanProgress {
  job_id: string;
  progress_percent: number;
  current_path: string;
  files_scanned: number;
  dirs_scanned: number;
  total_size_so_far: number;
}
