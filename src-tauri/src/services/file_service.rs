/// Serviço de ações em arquivos
/// Responsável por operações seguras de exclusão, movimentação e limpeza

use crate::models::*;
use crate::models::{AppError, AppResult};
use chrono::Utc;
use std::fs;
use std::path::Path;
use uuid::Uuid;

/// Gerenciador de ações em arquivos
pub struct FileManager;

impl FileManager {
    /// Exclui arquivo enviando para a lixeira (modo seguro)
    pub fn delete_to_trash(path: &str) -> AppResult<CleanupAction> {
        let file_path = Path::new(path);
        if !file_path.exists() {
            return Err(AppError::PathNotFound(path.to_string()));
        }

        let size = if file_path.is_file() {
            fs::metadata(file_path).map(|m| m.len()).unwrap_or(0)
        } else {
            Self::calculate_dir_size(path)
        };

        trash::delete(file_path).map_err(|e| AppError::DeleteError(e.to_string()))?;

        Ok(CleanupAction {
            id: Uuid::new_v4().to_string(),
            action_type: ActionType::MoveToTrash,
            target_path: path.to_string(),
            size_freed: size,
            timestamp: Utc::now().timestamp_millis(),
            status: ActionStatus::Completed,
            error_message: None,
        })
    }

    /// Exclui arquivo permanentemente
    pub fn delete_permanent(path: &str) -> AppResult<CleanupAction> {
        let file_path = Path::new(path);
        if !file_path.exists() {
            return Err(AppError::PathNotFound(path.to_string()));
        }

        let size = if file_path.is_file() {
            fs::metadata(file_path).map(|m| m.len()).unwrap_or(0)
        } else {
            Self::calculate_dir_size(path)
        };

        if file_path.is_dir() {
            fs::remove_dir_all(file_path)?;
        } else {
            fs::remove_file(file_path)?;
        }

        Ok(CleanupAction {
            id: Uuid::new_v4().to_string(),
            action_type: ActionType::Delete,
            target_path: path.to_string(),
            size_freed: size,
            timestamp: Utc::now().timestamp_millis(),
            status: ActionStatus::Completed,
            error_message: None,
        })
    }

    /// Move arquivo para outro local
    pub fn move_file(source: &str, destination: &str) -> AppResult<CleanupAction> {
        let source_path = Path::new(source);
        if !source_path.exists() {
            return Err(AppError::PathNotFound(source.to_string()));
        }

        let size = if source_path.is_file() {
            fs::metadata(source_path).map(|m| m.len()).unwrap_or(0)
        } else {
            Self::calculate_dir_size(source)
        };

        fs::rename(source, destination).map_err(|e| AppError::MoveError(e.to_string()))?;

        Ok(CleanupAction {
            id: Uuid::new_v4().to_string(),
            action_type: ActionType::Move,
            target_path: source.to_string(),
            size_freed: 0,
            timestamp: Utc::now().timestamp_millis(),
            status: ActionStatus::Completed,
            error_message: None,
        })
    }

    /// Limpa diretório temporário
    pub fn clean_temp_directory(path: &str) -> AppResult<CleanupAction> {
        let dir = Path::new(path);
        if !dir.exists() || !dir.is_dir() {
            return Err(AppError::PathNotFound(path.to_string()));
        }

        let mut total_freed = 0u64;
        let mut errors = Vec::new();

        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.filter_map(|e| e.ok()) {
                let entry_path = entry.path();
                let size = if entry_path.is_file() {
                    fs::metadata(&entry_path).map(|m| m.len()).unwrap_or(0)
                } else {
                    Self::calculate_dir_size(&entry_path.to_string_lossy())
                };

                let result = if entry_path.is_dir() {
                    fs::remove_dir_all(&entry_path)
                } else {
                    fs::remove_file(&entry_path)
                };

                match result {
                    Ok(_) => total_freed += size,
                    Err(e) => errors.push(format!(
                        "{}: {}",
                        entry_path.to_string_lossy(),
                        e
                    )),
                }
            }
        }

        let error_message = if errors.is_empty() {
            None
        } else {
            Some(format!("{} erros durante limpeza", errors.len()))
        };

        Ok(CleanupAction {
            id: Uuid::new_v4().to_string(),
            action_type: ActionType::CleanTemp,
            target_path: path.to_string(),
            size_freed: total_freed,
            timestamp: Utc::now().timestamp_millis(),
            status: if errors.is_empty() {
                ActionStatus::Completed
            } else {
                ActionStatus::Completed
            },
            error_message,
        })
    }

    /// Abre localização do arquivo no explorador do sistema
    pub fn open_in_explorer(path: &str) -> AppResult<()> {
        let file_path = Path::new(path);
        let dir = if file_path.is_dir() {
            path.to_string()
        } else {
            file_path
                .parent()
                .map(|p| p.to_string_lossy().to_string())
                .unwrap_or_else(|| path.to_string())
        };

        std::process::Command::new("explorer")
            .arg(&dir)
            .spawn()?;

        Ok(())
    }

    /// Calcula tamanho total de um diretório
    fn calculate_dir_size(path: &str) -> u64 {
        walkdir::WalkDir::new(path)
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.path().is_file())
            .filter_map(|e| fs::metadata(e.path()).ok())
            .map(|m| m.len())
            .sum()
    }
}
