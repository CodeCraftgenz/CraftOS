/// Commands Tauri — interface entre frontend e backend

use crate::models::*;
use crate::services::file_service::FileManager;
use crate::services::scan_service;
use crate::services::system_service::SystemMonitor;
use std::time::{Duration, SystemTime};
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
        .map_err(|e| e.to_string())
}

/// Scan completo rápido com passada única (para maiores arquivos e estatísticas)
#[tauri::command]
pub fn fast_scan(root_path: String, max_depth: Option<usize>) -> Result<ScanResult, String> {
    scan_service::fast_scan(&root_path, max_depth.unwrap_or(8))
        .map_err(|e| e.to_string())
}

/// Scan rápido de primeiro nível (leve, para navegação)
#[tauri::command]
pub fn quick_scan(path: String) -> Result<Vec<DirectoryNode>, String> {
    scan_service::scan_folder_sizes(&path, 1)
        .map_err(|e| e.to_string())
}

// ==========================================
// COMMANDS: AÇÕES EM ARQUIVOS
// ==========================================

#[tauri::command]
pub fn delete_to_trash(path: String) -> Result<CleanupAction, String> {
    FileManager::delete_to_trash(&path)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_permanent(path: String) -> Result<CleanupAction, String> {
    FileManager::delete_permanent(&path)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn move_file(source: String, destination: String) -> Result<CleanupAction, String> {
    FileManager::move_file(&source, &destination)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn clean_temp_directory(path: String) -> Result<CleanupAction, String> {
    FileManager::clean_temp_directory(&path)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn open_in_explorer(path: String) -> Result<(), String> {
    FileManager::open_in_explorer(&path)
        .map_err(|e| e.to_string())
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

/// Coleta caminhos de arquivos dentro de um diretório (até max_items)
fn collect_paths(dir: &str, max_depth: usize, max_items: usize) -> Vec<String> {
    walkdir::WalkDir::new(dir)
        .max_depth(max_depth)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path() != std::path::Path::new(dir))
        .take(max_items)
        .map(|e| e.path().to_string_lossy().to_string())
        .collect()
}

/// Calcula tamanho total de um diretório
fn dir_size(dir: &str, max_depth: usize) -> u64 {
    walkdir::WalkDir::new(dir)
        .max_depth(max_depth)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().is_file())
        .filter_map(|e| std::fs::metadata(e.path()).ok())
        .map(|m| m.len())
        .sum()
}

#[tauri::command]
pub async fn get_cleanup_suggestions() -> Result<Vec<CleanupSuggestion>, String> {
    let mut suggestions = Vec::new();
    let user_profile = std::env::var("USERPROFILE").unwrap_or_default();
    let local_appdata = std::env::var("LOCALAPPDATA").unwrap_or_default();

    // 1. Arquivos Temporários do Usuário
    let user_temp = format!("{}\\AppData\\Local\\Temp", user_profile);
    if std::path::Path::new(&user_temp).exists() {
        let size = dir_size(&user_temp, 3);
        if size > 0 {
            suggestions.push(CleanupSuggestion {
                category: "Arquivos Temporários do Usuário".to_string(),
                description: "Arquivos temporários criados por aplicativos. Seguro remover.".to_string(),
                paths: collect_paths(&user_temp, 1, 100),
                total_size: size,
                risk_level: "baixo".to_string(),
            });
        }
    }

    // 2. Arquivos Temporários do Windows
    let win_temp = "C:\\Windows\\Temp".to_string();
    if std::path::Path::new(&win_temp).exists() {
        let size = dir_size(&win_temp, 3);
        if size > 0 {
            suggestions.push(CleanupSuggestion {
                category: "Arquivos Temporários do Windows".to_string(),
                description: "Temporários do sistema operacional. Seguro remover.".to_string(),
                paths: collect_paths(&win_temp, 1, 100),
                total_size: size,
                risk_level: "baixo".to_string(),
            });
        }
    }

    // 3. Downloads Antigos (>30 dias)
    let downloads = format!("{}\\Downloads", user_profile);
    if std::path::Path::new(&downloads).exists() {
        let thirty_days_ago = SystemTime::now() - Duration::from_secs(30 * 24 * 3600);
        let mut old_paths = Vec::new();
        let mut old_size = 0u64;

        if let Ok(entries) = std::fs::read_dir(&downloads) {
            for entry in entries.filter_map(|e| e.ok()) {
                let path = entry.path();
                if let Ok(meta) = std::fs::metadata(&path) {
                    let is_old = meta.modified()
                        .map(|m| m < thirty_days_ago)
                        .unwrap_or(false);
                    if is_old {
                        let size = if meta.is_file() {
                            meta.len()
                        } else {
                            dir_size(&path.to_string_lossy(), 3)
                        };
                        old_size += size;
                        old_paths.push(path.to_string_lossy().to_string());
                        if old_paths.len() >= 100 { break; }
                    }
                }
            }
        }

        if old_size > 0 {
            suggestions.push(CleanupSuggestion {
                category: "Downloads Antigos".to_string(),
                description: format!("Arquivos na pasta Downloads com mais de 30 dias. {} itens encontrados.", old_paths.len()),
                paths: old_paths,
                total_size: old_size,
                risk_level: "médio".to_string(),
            });
        }
    }

    // 4. Cache de Navegadores
    let browser_caches = vec![
        format!("{}\\Google\\Chrome\\User Data\\Default\\Cache", local_appdata),
        format!("{}\\Google\\Chrome\\User Data\\Default\\Code Cache", local_appdata),
        format!("{}\\Microsoft\\Edge\\User Data\\Default\\Cache", local_appdata),
        format!("{}\\Microsoft\\Edge\\User Data\\Default\\Code Cache", local_appdata),
    ];
    let mut cache_size = 0u64;
    let mut cache_paths = Vec::new();
    for cache_dir in &browser_caches {
        if std::path::Path::new(cache_dir).exists() {
            cache_size += dir_size(cache_dir, 3);
            cache_paths.push(cache_dir.clone());
        }
    }
    if cache_size > 0 {
        suggestions.push(CleanupSuggestion {
            category: "Cache de Navegadores".to_string(),
            description: "Cache do Chrome e Edge. Será recriado automaticamente.".to_string(),
            paths: cache_paths,
            total_size: cache_size,
            risk_level: "baixo".to_string(),
        });
    }

    // 5. Logs Antigos (>7 dias)
    let logs_dir = format!("{}\\AppData\\Local", user_profile);
    if std::path::Path::new(&logs_dir).exists() {
        let seven_days_ago = SystemTime::now() - Duration::from_secs(7 * 24 * 3600);
        let mut log_paths = Vec::new();
        let mut log_size = 0u64;

        for entry in walkdir::WalkDir::new(&logs_dir)
            .max_depth(2)
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| {
                e.path().is_file() && e.path().extension()
                    .map(|ext| ext == "log" || ext == "tmp" || ext == "etl")
                    .unwrap_or(false)
            })
        {
            if let Ok(meta) = std::fs::metadata(entry.path()) {
                let is_old = meta.modified()
                    .map(|m| m < seven_days_ago)
                    .unwrap_or(false);
                if is_old {
                    log_size += meta.len();
                    log_paths.push(entry.path().to_string_lossy().to_string());
                    if log_paths.len() >= 100 { break; }
                }
            }
        }

        if log_size > 1_000_000 {
            suggestions.push(CleanupSuggestion {
                category: "Logs e Arquivos Antigos".to_string(),
                description: format!("{} arquivos de log com mais de 7 dias.", log_paths.len()),
                paths: log_paths,
                total_size: log_size,
                risk_level: "baixo".to_string(),
            });
        }
    }

    // 6. Thumbnails Cache
    let thumbs_dir = format!("{}\\Microsoft\\Windows\\Explorer", local_appdata);
    if std::path::Path::new(&thumbs_dir).exists() {
        let mut thumb_paths = Vec::new();
        let mut thumb_size = 0u64;

        if let Ok(entries) = std::fs::read_dir(&thumbs_dir) {
            for entry in entries.filter_map(|e| e.ok()) {
                let name = entry.file_name().to_string_lossy().to_string();
                if name.starts_with("thumbcache_") || name.starts_with("iconcache_") {
                    if let Ok(meta) = entry.metadata() {
                        thumb_size += meta.len();
                        thumb_paths.push(entry.path().to_string_lossy().to_string());
                    }
                }
            }
        }

        if thumb_size > 0 {
            suggestions.push(CleanupSuggestion {
                category: "Cache de Miniaturas".to_string(),
                description: "Cache de thumbnails do Windows Explorer. Será recriado.".to_string(),
                paths: thumb_paths,
                total_size: thumb_size,
                risk_level: "baixo".to_string(),
            });
        }
    }

    // Ordena por tamanho (maior primeiro)
    suggestions.sort_by(|a, b| b.total_size.cmp(&a.total_size));

    Ok(suggestions)
}

// ==========================================
// COMMANDS: DETALHES DE CATEGORIA
// ==========================================

/// Retorna detalhes dos arquivos/pastas em um caminho específico
#[tauri::command]
pub async fn get_category_details(category_path: String) -> Result<Vec<FileDetail>, String> {
    let path = std::path::Path::new(&category_path);
    if !path.exists() {
        return Err(format!("Caminho não encontrado: {}", category_path));
    }

    let mut details: Vec<FileDetail> = Vec::new();

    if path.is_dir() {
        if let Ok(entries) = std::fs::read_dir(path) {
            for entry in entries.filter_map(|e| e.ok()).take(200) {
                let entry_path = entry.path();
                let meta = match std::fs::metadata(&entry_path) {
                    Ok(m) => m,
                    Err(_) => continue,
                };

                let size = if meta.is_file() {
                    meta.len()
                } else {
                    dir_size(&entry_path.to_string_lossy(), 3)
                };

                let modified_at = meta.modified()
                    .ok()
                    .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                    .map(|d| d.as_millis() as i64)
                    .unwrap_or(0);

                details.push(FileDetail {
                    name: entry_path.file_name()
                        .map(|n| n.to_string_lossy().to_string())
                        .unwrap_or_default(),
                    path: entry_path.to_string_lossy().to_string(),
                    size,
                    is_dir: meta.is_dir(),
                    modified_at,
                });
            }
        }
    } else {
        // Arquivo individual
        if let Ok(meta) = std::fs::metadata(path) {
            let modified_at = meta.modified()
                .ok()
                .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                .map(|d| d.as_millis() as i64)
                .unwrap_or(0);

            details.push(FileDetail {
                name: path.file_name()
                    .map(|n| n.to_string_lossy().to_string())
                    .unwrap_or_default(),
                path: category_path,
                size: meta.len(),
                is_dir: false,
                modified_at,
            });
        }
    }

    // Ordena por tamanho (maior primeiro)
    details.sort_by(|a, b| b.size.cmp(&a.size));

    Ok(details)
}
