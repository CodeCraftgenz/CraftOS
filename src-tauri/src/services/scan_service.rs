/// Serviço de scan de diretórios — estilo WizTree
/// Scan rápido por nível com cálculo recursivo de tamanho

use crate::models::*;
use chrono::Utc;
use std::fs;
use std::path::Path;
use uuid::Uuid;
use walkdir::WalkDir;

/// Calcula o tamanho total de um diretório recursivamente (rápido, sem coletar arquivos)
fn calc_dir_size(path: &Path, max_depth: usize) -> u64 {
    WalkDir::new(path)
        .max_depth(max_depth)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .filter_map(|e| e.metadata().ok())
        .map(|m| m.len())
        .sum()
}

/// Scan das pastas de primeiro nível com tamanho recursivo de cada uma
pub fn scan_folder_sizes(root_path: &str, depth: usize) -> Result<Vec<DirectoryNode>, String> {
    let root = Path::new(root_path);
    if !root.exists() {
        return Err(format!("Caminho não encontrado: {}", root_path));
    }

    let entries = fs::read_dir(root).map_err(|e| format!("Erro ao ler diretório: {}", e))?;

    let mut dirs: Vec<DirectoryNode> = Vec::new();
    let mut root_files_size = 0u64;

    for entry in entries.filter_map(|e| e.ok()) {
        let path = entry.path();

        if path.is_dir() {
            let name = path
                .file_name()
                .map(|n| n.to_string_lossy().to_string())
                .unwrap_or_default();

            // Calcula tamanho recursivo do diretório
            let size = calc_dir_size(&path, depth);

            // Conta filhos diretos
            let children_count = fs::read_dir(&path)
                .map(|entries| entries.count() as u32)
                .unwrap_or(0);

            dirs.push(DirectoryNode {
                path: path.to_string_lossy().to_string(),
                name,
                size,
                children_count,
                depth: 1,
                parent_path: Some(root_path.to_string()),
                children: vec![],
                files: vec![],
            });
        } else if let Ok(meta) = fs::metadata(&path) {
            root_files_size += meta.len();
        }
    }

    // Adiciona "Arquivos na raiz" se houver
    if root_files_size > 0 {
        dirs.push(DirectoryNode {
            path: root_path.to_string(),
            name: "[Arquivos na raiz]".to_string(),
            size: root_files_size,
            children_count: 0,
            depth: 1,
            parent_path: Some(root_path.to_string()),
            children: vec![],
            files: vec![],
        });
    }

    // Ordena por tamanho (maior primeiro)
    dirs.sort_by(|a, b| b.size.cmp(&a.size));

    Ok(dirs)
}

/// Scan completo rápido — passada única, sem contagem prévia
pub fn fast_scan(
    root_path: &str,
    max_depth: usize,
) -> Result<ScanResult, String> {
    let root = Path::new(root_path);
    if !root.exists() {
        return Err(format!("Caminho não encontrado: {}", root_path));
    }

    let job_id = Uuid::new_v4().to_string();
    let started_at = Utc::now().timestamp_millis();

    let mut total_size = 0u64;
    let mut total_files = 0u64;
    let mut total_dirs = 0u64;
    let mut largest_files: Vec<FileItem> = Vec::new();
    let mut dir_sizes: std::collections::HashMap<String, u64> = std::collections::HashMap::new();

    // Passada única
    let walker = WalkDir::new(root_path)
        .max_depth(max_depth)
        .follow_links(false);

    for entry in walker.into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();

        if path.is_file() {
            if let Ok(metadata) = entry.metadata() {
                let size = metadata.len();
                total_size += size;
                total_files += 1;

                // Acumula nos diretórios pai
                if let Some(parent) = path.parent() {
                    *dir_sizes
                        .entry(parent.to_string_lossy().to_string())
                        .or_insert(0) += size;
                }

                // Mantém top 100 maiores arquivos
                let name = path
                    .file_name()
                    .map(|n| n.to_string_lossy().to_string())
                    .unwrap_or_default();
                let ext = path
                    .extension()
                    .map(|e| e.to_string_lossy().to_string())
                    .unwrap_or_default();
                let modified = metadata
                    .modified()
                    .ok()
                    .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                    .map(|d| d.as_millis() as i64)
                    .unwrap_or(0);

                largest_files.push(FileItem {
                    path: path.to_string_lossy().to_string(),
                    name: name.clone(),
                    size,
                    extension: ext.clone(),
                    modified_at: modified,
                    is_temp: is_temp_file(&name, &ext),
                    is_old: is_old_file(modified, 90),
                    is_hidden: name.starts_with('.'),
                });

                // Trim periodicamente para não usar muita memória
                if largest_files.len() > 200 {
                    largest_files.sort_by(|a, b| b.size.cmp(&a.size));
                    largest_files.truncate(100);
                }
            }
        } else if path.is_dir() {
            total_dirs += 1;
        }
    }

    // Finaliza maiores arquivos
    largest_files.sort_by(|a, b| b.size.cmp(&a.size));
    largest_files.truncate(100);

    // Maiores diretórios
    let mut largest_dirs: Vec<DirectoryNode> = dir_sizes
        .iter()
        .map(|(path, &size)| DirectoryNode {
            path: path.clone(),
            name: Path::new(path)
                .file_name()
                .map(|n| n.to_string_lossy().to_string())
                .unwrap_or_default(),
            size,
            children_count: 0,
            depth: 0,
            parent_path: None,
            children: vec![],
            files: vec![],
        })
        .collect();
    largest_dirs.sort_by(|a, b| b.size.cmp(&a.size));
    largest_dirs.truncate(50);

    let finished_at = Utc::now().timestamp_millis();

    let job = ScanJob {
        id: job_id,
        root_path: root_path.to_string(),
        status: ScanStatus::Completed,
        started_at: Some(started_at),
        finished_at: Some(finished_at),
        total_size,
        total_files,
        total_dirs,
        progress_percent: 100.0,
        current_path: root_path.to_string(),
    };

    // Root node simples
    let root_node = DirectoryNode {
        path: root_path.to_string(),
        name: root_path.to_string(),
        size: total_size,
        children_count: total_dirs as u32,
        depth: 0,
        parent_path: None,
        children: vec![],
        files: vec![],
    };

    // Sugestões de limpeza
    let suggestions = generate_suggestions(&largest_files);

    Ok(ScanResult {
        job,
        root: root_node,
        largest_files,
        largest_dirs,
        suggestions,
    })
}

fn is_temp_file(name: &str, ext: &str) -> bool {
    let temp_extensions = ["tmp", "temp", "bak", "old", "cache", "log"];
    let temp_patterns = ["~$", "thumbs.db", "desktop.ini", ".ds_store"];
    temp_extensions.contains(&ext.to_lowercase().as_str())
        || temp_patterns
            .iter()
            .any(|p| name.to_lowercase().contains(p))
}

fn is_old_file(modified_ms: i64, days: i64) -> bool {
    let now = Utc::now().timestamp_millis();
    let threshold = days * 24 * 60 * 60 * 1000;
    (now - modified_ms) > threshold
}

fn generate_suggestions(files: &[FileItem]) -> Vec<CleanupSuggestion> {
    let mut suggestions = Vec::new();

    let temp_files: Vec<String> = files.iter().filter(|f| f.is_temp).map(|f| f.path.clone()).collect();
    let temp_size: u64 = files.iter().filter(|f| f.is_temp).map(|f| f.size).sum();
    if !temp_files.is_empty() {
        suggestions.push(CleanupSuggestion {
            category: "Arquivos Temporários".to_string(),
            description: "Podem ser removidos com segurança".to_string(),
            paths: temp_files,
            total_size: temp_size,
            risk_level: "baixo".to_string(),
        });
    }

    let large_files: Vec<String> = files.iter().filter(|f| f.size > 100 * 1024 * 1024).map(|f| f.path.clone()).collect();
    let large_size: u64 = files.iter().filter(|f| f.size > 100 * 1024 * 1024).map(|f| f.size).sum();
    if !large_files.is_empty() {
        suggestions.push(CleanupSuggestion {
            category: "Arquivos Grandes (>100MB)".to_string(),
            description: "Verifique se são necessários".to_string(),
            paths: large_files,
            total_size: large_size,
            risk_level: "alto".to_string(),
        });
    }

    suggestions
}
