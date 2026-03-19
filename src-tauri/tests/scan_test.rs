/// Testes de integração do serviço de scan

use std::fs;
use std::path::Path;

// Cria estrutura temporária para testes
fn create_test_dir() -> tempfile::TempDir {
    let dir = tempfile::tempdir().unwrap();
    let root = dir.path();

    // Cria subpastas
    fs::create_dir_all(root.join("pasta_a")).unwrap();
    fs::create_dir_all(root.join("pasta_b/sub")).unwrap();
    fs::create_dir_all(root.join("pasta_c")).unwrap();

    // Cria arquivos com tamanhos conhecidos
    fs::write(root.join("arquivo_raiz.txt"), "x".repeat(1000)).unwrap();
    fs::write(root.join("pasta_a/grande.bin"), "x".repeat(50000)).unwrap();
    fs::write(root.join("pasta_a/pequeno.txt"), "x".repeat(100)).unwrap();
    fs::write(root.join("pasta_b/medio.log"), "x".repeat(5000)).unwrap();
    fs::write(root.join("pasta_b/sub/deep.tmp"), "x".repeat(2000)).unwrap();

    dir
}

#[test]
fn test_scan_folder_sizes_retorna_pastas_ordenadas() {
    let dir = create_test_dir();
    let path = dir.path().to_string_lossy().to_string();

    let result = tracos_lib::services::scan_service::scan_folder_sizes(&path, 10);
    assert!(result.is_ok());

    let folders = result.unwrap();
    // Deve ter pasta_a, pasta_b, pasta_c e [Arquivos na raiz]
    assert!(folders.len() >= 3);

    // Deve estar ordenado por tamanho (maior primeiro)
    for i in 1..folders.len() {
        assert!(folders[i - 1].size >= folders[i].size);
    }
}

#[test]
fn test_scan_folder_sizes_path_invalido() {
    let result = tracos_lib::services::scan_service::scan_folder_sizes(
        "C:\\caminho_que_nao_existe_xyz",
        10,
    );
    assert!(result.is_err());
}

#[test]
fn test_fast_scan_retorna_resultado_completo() {
    let dir = create_test_dir();
    let path = dir.path().to_string_lossy().to_string();

    let result = tracos_lib::services::scan_service::fast_scan(&path, 5);
    assert!(result.is_ok());

    let scan = result.unwrap();
    assert_eq!(scan.job.status, tracos_lib::models::ScanStatus::Completed);
    assert!(scan.job.total_size > 0);
    assert!(scan.job.total_files >= 5);
    assert!(scan.job.total_dirs >= 3);
    assert!(scan.largest_files.len() <= 100);
}

#[test]
fn test_fast_scan_path_invalido() {
    let result = tracos_lib::services::scan_service::fast_scan(
        "Z:\\inexistente",
        5,
    );
    assert!(result.is_err());
}
