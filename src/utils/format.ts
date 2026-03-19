/// Utilitários de formatação do TracOS

/** Formata bytes em unidade legível (KB, MB, GB, TB) */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** Formata percentual com casas decimais */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Formata timestamp em data/hora legível */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString("pt-BR");
}

/** Formata timestamp em hora apenas */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/** Formata duração em segundos para texto legível */
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/** Retorna cor baseada no percentual de uso */
export function getUsageColor(percent: number): string {
  if (percent >= 90) return "#F44336";
  if (percent >= 75) return "#FF9800";
  if (percent >= 50) return "#FFC107";
  return "#4CAF50";
}

/** Retorna label de status baseado no percentual */
export function getStatusLabel(percent: number): string {
  if (percent >= 90) return "Crítico";
  if (percent >= 75) return "Alerta";
  if (percent >= 50) return "Atenção";
  return "Normal";
}

/** Retorna a classe CSS do status */
export function getStatusClass(percent: number): string {
  if (percent >= 90) return "text-red-400";
  if (percent >= 75) return "text-orange-400";
  if (percent >= 50) return "text-yellow-400";
  return "text-green-400";
}

/** Trunca texto com reticências */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/** Formata extensão de arquivo para display */
export function formatExtension(ext: string): string {
  if (!ext) return "Sem extensão";
  return ext.startsWith(".") ? ext.toUpperCase() : `.${ext.toUpperCase()}`;
}
