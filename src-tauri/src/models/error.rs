/// Modelo de erro tipado do CraftOS

use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Caminho não encontrado: {0}")]
    PathNotFound(String),

    #[error("Erro de permissão: {0}")]
    PermissionDenied(String),

    #[error("Erro ao ler diretório: {0}")]
    ReadDirError(String),

    #[error("Erro ao excluir arquivo: {0}")]
    DeleteError(String),

    #[error("Erro ao mover arquivo: {0}")]
    MoveError(String),

    #[error("Erro de IO: {0}")]
    IoError(String),

    #[error("Operação cancelada")]
    Cancelled,

    #[error("Erro interno: {0}")]
    Internal(String),
}

impl From<std::io::Error> for AppError {
    fn from(e: std::io::Error) -> Self {
        match e.kind() {
            std::io::ErrorKind::NotFound => AppError::PathNotFound(e.to_string()),
            std::io::ErrorKind::PermissionDenied => AppError::PermissionDenied(e.to_string()),
            _ => AppError::IoError(e.to_string()),
        }
    }
}

pub type AppResult<T> = Result<T, AppError>;
