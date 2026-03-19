/// TracOS - Central de Controle Tracbel Agro

mod commands;
mod models;
mod services;

use services::system_service::SystemMonitor;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .manage(SystemMonitor::new())
        .invoke_handler(tauri::generate_handler![
            commands::get_system_metrics,
            commands::get_resource_history,
            commands::scan_folder_sizes,
            commands::fast_scan,
            commands::quick_scan,
            commands::delete_to_trash,
            commands::delete_permanent,
            commands::move_file,
            commands::clean_temp_directory,
            commands::open_in_explorer,
            commands::get_default_settings,
            commands::get_cleanup_suggestions,
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao iniciar TracOS");
}
