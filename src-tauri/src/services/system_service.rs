/// Serviço de monitoramento do sistema
/// Responsável por coletar métricas de CPU, RAM e disco em tempo real

use sysinfo::{Disks, System};
use crate::models::{DiskInfo, SystemMetrics, ResourceHistory};
use chrono::Utc;
use uuid::Uuid;
use std::sync::Mutex;

/// Estado global do monitor de sistema
pub struct SystemMonitor {
    system: Mutex<System>,
    history: Mutex<Vec<ResourceHistory>>,
}

impl SystemMonitor {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        Self {
            system: Mutex::new(sys),
            history: Mutex::new(Vec::new()),
        }
    }

    /// Coleta métricas atuais do sistema
    pub fn get_metrics(&self) -> SystemMetrics {
        let mut sys = self.system.lock().unwrap();
        sys.refresh_all();

        // Coleta uso de CPU por core
        let cpu_per_core: Vec<f64> = sys.cpus().iter().map(|c| c.cpu_usage() as f64).collect();
        let cpu_usage = sys.global_cpu_usage() as f64;

        // Coleta informações de disco
        let disks_info = Disks::new_with_refreshed_list();
        let disks: Vec<DiskInfo> = disks_info
            .iter()
            .map(|d| {
                let total = d.total_space();
                let available = d.available_space();
                let used = total.saturating_sub(available);
                let usage_percent = if total > 0 {
                    (used as f64 / total as f64) * 100.0
                } else {
                    0.0
                };
                DiskInfo {
                    name: d.name().to_string_lossy().to_string(),
                    mount_point: d.mount_point().to_string_lossy().to_string(),
                    total_space: total,
                    used_space: used,
                    available_space: available,
                    fs_type: d.file_system().to_string_lossy().to_string(),
                    usage_percent,
                }
            })
            .collect();

        let ram_used = sys.used_memory();
        let ram_total = sys.total_memory();
        let ram_percent = if ram_total > 0 {
            (ram_used as f64 / ram_total as f64) * 100.0
        } else {
            0.0
        };

        let timestamp = Utc::now().timestamp_millis();

        // Salva no histórico
        let history_entry = ResourceHistory {
            id: Uuid::new_v4().to_string(),
            timestamp,
            cpu: cpu_usage,
            ram: ram_percent,
            disk_read: 0,
            disk_write: 0,
        };

        if let Ok(mut history) = self.history.lock() {
            history.push(history_entry);
            // Mantém apenas os últimos 500 registros em memória
            if history.len() > 500 {
                history.drain(0..100);
            }
        }

        SystemMetrics {
            timestamp,
            cpu_usage,
            cpu_count: sys.cpus().len(),
            cpu_per_core,
            ram_used,
            ram_total,
            ram_percent,
            disks,
            hostname: System::host_name().unwrap_or_default(),
            os_name: System::name().unwrap_or_default(),
            os_version: System::os_version().unwrap_or_default(),
            uptime: System::uptime(),
        }
    }

    /// Retorna o histórico de recursos
    pub fn get_history(&self, limit: usize) -> Vec<ResourceHistory> {
        let history = self.history.lock().unwrap();
        let start = if history.len() > limit {
            history.len() - limit
        } else {
            0
        };
        history[start..].to_vec()
    }
}
