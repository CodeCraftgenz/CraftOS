/// Commands Tauri — interface entre frontend e backend

use crate::models::*;
use crate::services::file_service::FileManager;
use crate::services::scan_service;
use crate::services::system_service::SystemMonitor;
use tauri::State;

// ==========================================
// COMMANDS: SISTEMA
// ==========================================

#[tauri::command]
pub fn get_system_metrics(monitor: State<'_, SystemMonitor>) -> Result<SystemMetrics, String> {
    Ok(monitor.get_metrics())
}

#[tauri::command]
pub fn get_resource_history(
    monitor: State<'_, SystemMonitor>,
    limit: usize,
) -> Result<Vec<ResourceHistory>, String> {
    Ok(monitor.get_history(limit))
}

// ==========================================
// COMMANDS: SCAN DE DISCO (ESTILO WIZTREE)
// ==========================================

/// Scan de pastas de primeiro nível com tamanho recursivo — rápido, estilo WizTree
#[tauri::command]
pub fn scan_folder_sizes(root_path: String, depth: Option<usize>) -> Result<Vec<DirectoryNode>, String> {
    scan_service::scan_folder_sizes(&root_path, depth.unwrap_or(15))
}

/// Scan completo rápido com passada única (para maiores arquivos e estatísticas)
#[tauri::command]
pub fn fast_scan(root_path: String, max_depth: Option<usize>) -> Result<ScanResult, String> {
    scan_service::fast_scan(&root_path, max_depth.unwrap_or(8))
}

/// Scan rápido de primeiro nível (leve, para navegação)
#[tauri::command]
pub fn quick_scan(path: String) -> Result<Vec<DirectoryNode>, String> {
    scan_service::scan_folder_sizes(&path, 1)
}

// ==========================================
// COMMANDS: AÇÕES EM ARQUIVOS
// ==========================================

#[tauri::command]
pub fn delete_to_trash(path: String) -> Result<CleanupAction, String> {
    FileManager::delete_to_trash(&path)
}

#[tauri::command]
pub fn delete_permanent(path: String) -> Result<CleanupAction, String> {
    FileManager::delete_permanent(&path)
}

#[tauri::command]
pub fn move_file(source: String, destination: String) -> Result<CleanupAction, String> {
    FileManager::move_file(&source, &destination)
}

#[tauri::command]
pub fn clean_temp_directory(path: String) -> Result<CleanupAction, String> {
    FileManager::clean_temp_directory(&path)
}

#[tauri::command]
pub fn open_in_explorer(path: String) -> Result<(), String> {
    FileManager::open_in_explorer(&path)
}

// ==========================================
// COMMANDS: CONFIGURAÇÕES
// ==========================================

#[tauri::command]
pub fn get_default_settings() -> UserSettings {
    UserSettings::default()
}

// ==========================================
// COMMANDS: LIMPEZA INTELIGENTE
// ==========================================

#[tauri::command]
pub fn get_cleanup_suggestions() -> Result<Vec<CleanupSuggestion>, String> {
    let mut suggestions = Vec::new();
    let user_profile = std::env::var("USERPROFILE").unwrap_or_default();

    let temp_dirs = vec![
        (format!("{}\\AppData\\Local\\Temp", user_profile), "Temp do Usuário"),
        ("C:\\Windows\\Temp".to_string(), "Temp do Windows"),
        (format!("{}\\Downloads", user_profile), "Downloads"),
    ];

    for (dir, label) in temp_dirs {
        let path = std::path::Path::new(&dir);
        if path.exists() {
            let size: u64 = walkdir::WalkDir::new(&dir)
                .max_depth(3)
                .into_iter()
                .filter_map(|e| e.ok())
                .filter(|e| e.path().is_file())
                .filter_map(|e| std::fs::metadata(e.path()).ok())
                .map(|m| m.len())
                .sum();

            if size > 0 {
                suggestions.push(CleanupSuggestion {
                    category: label.to_string(),
                    description: format!("Pasta: {}", dir),
                    paths: vec![dir],
                    total_size: size,
                    risk_level: if label.contains("Download") { "médio".to_string() } else { "baixo".to_string() },
                });
            }
        }
    }

    Ok(suggestions)
}
