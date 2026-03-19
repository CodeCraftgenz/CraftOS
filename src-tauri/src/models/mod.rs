pub mod error;
pub use error::{AppError, AppResult};

/// Modelos de dados do TracOS
/// Todas as entidades do sistema são definidas aqui

use serde::{Deserialize, Serialize};

/// Informações de um disco do sistema
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiskInfo {
    pub name: String,
    pub mount_point: String,
    pub total_space: u64,
    pub used_space: u64,
    pub available_space: u64,
    pub fs_type: String,
    pub usage_percent: f64,
}

/// Métricas do sistema em tempo real
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub timestamp: i64,
    pub cpu_usage: f64,
    pub cpu_count: usize,
    pub cpu_per_core: Vec<f64>,
    pub ram_used: u64,
    pub ram_total: u64,
    pub ram_percent: f64,
    pub disks: Vec<DiskInfo>,
    pub hostname: String,
    pub os_name: String,
    pub os_version: String,
    pub uptime: u64,
}

/// Status de um job de scan
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ScanStatus {
    Pending,
    Running,
    Completed,
    Cancelled,
    Error,
}

/// Job de scan de diretório
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanJob {
    pub id: String,
    pub root_path: String,
    pub status: ScanStatus,
    pub started_at: Option<i64>,
    pub finished_at: Option<i64>,
    pub total_size: u64,
    pub total_files: u64,
    pub total_dirs: u64,
    pub progress_percent: f64,
    pub current_path: String,
}

/// Nó de diretório na árvore de scan
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DirectoryNode {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub children_count: u32,
    pub depth: u32,
    pub parent_path: Option<String>,
    pub children: Vec<DirectoryNode>,
    pub files: Vec<FileItem>,
}

/// Item de arquivo individual
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileItem {
    pub path: String,
    pub name: String,
    pub size: u64,
    pub extension: String,
    pub modified_at: i64,
    pub is_temp: bool,
    pub is_old: bool,
    pub is_hidden: bool,
}

/// Dados para o treemap de disco
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TreemapNode {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub children: Vec<TreemapNode>,
    pub color: Option<String>,
}

/// Histórico de uso de recursos
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceHistory {
    pub id: String,
    pub timestamp: i64,
    pub cpu: f64,
    pub ram: f64,
    pub disk_read: u64,
    pub disk_write: u64,
}

/// Tipo de ação de limpeza
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ActionType {
    Delete,
    MoveToTrash,
    Move,
    Copy,
    CleanTemp,
    CleanDownloads,
}

/// Status de uma ação
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ActionStatus {
    Pending,
    Completed,
    Failed,
    Reverted,
}

/// Ação de limpeza executada
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CleanupAction {
    pub id: String,
    pub action_type: ActionType,
    pub target_path: String,
    pub size_freed: u64,
    pub timestamp: i64,
    pub status: ActionStatus,
    pub error_message: Option<String>,
}

/// Configurações do usuário
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserSettings {
    pub update_interval: u64,
    pub ignored_paths: Vec<String>,
    pub safe_mode: bool,
    pub theme: String,
    pub size_unit: String,
    pub auto_cleanup: bool,
    pub max_history_days: u32,
}

impl Default for UserSettings {
    fn default() -> Self {
        Self {
            update_interval: 2000,
            ignored_paths: vec![],
            safe_mode: true,
            theme: "dark".to_string(),
            size_unit: "auto".to_string(),
            auto_cleanup: false,
            max_history_days: 30,
        }
    }
}

/// Nível de log
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LogLevel {
    Info,
    Warning,
    Error,
    Debug,
}

/// Registro de log do aplicativo
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppLog {
    pub id: String,
    pub timestamp: i64,
    pub level: LogLevel,
    pub message: String,
    pub context: Option<String>,
}

/// Sugestão de limpeza
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CleanupSuggestion {
    pub category: String,
    pub description: String,
    pub paths: Vec<String>,
    pub total_size: u64,
    pub risk_level: String,
}

/// Resultado do scan com estatísticas
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanResult {
    pub job: ScanJob,
    pub root: DirectoryNode,
    pub largest_files: Vec<FileItem>,
    pub largest_dirs: Vec<DirectoryNode>,
    pub suggestions: Vec<CleanupSuggestion>,
}

/// Progresso do scan enviado ao frontend
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanProgress {
    pub job_id: String,
    pub progress_percent: f64,
    pub current_path: String,
    pub files_scanned: u64,
    pub dirs_scanned: u64,
    pub total_size_so_far: u64,
}
