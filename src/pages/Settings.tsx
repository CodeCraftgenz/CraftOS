/// Configurações — preferências do usuário

import { useSettingsStore } from "../stores/settingsStore";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";

const PageIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ${
        checked ? "bg-primary" : "bg-border-light"
      }`}
    >
      <div
        className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-[20px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

export function Settings() {
  const settings = useSettingsStore();

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader
        title="Configurações"
        subtitle="Personalize o comportamento do TracOS"
        icon={PageIcon}
        actions={<Button variant="ghost" size="sm" onClick={settings.resetSettings}>Restaurar Padrões</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monitoramento */}
        <div className="card-static p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-5">Monitoramento</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] text-text-muted font-medium mb-1.5">Intervalo de atualização (ms)</label>
              <input type="number" value={settings.update_interval}
                onChange={(e) => settings.updateSettings({ update_interval: Number(e.target.value) })}
                min={500} max={10000} step={500} />
              <p className="text-[10px] text-text-muted mt-1">Menor = mais preciso, maior consumo</p>
            </div>
            <div>
              <label className="block text-[11px] text-text-muted font-medium mb-1.5">Dias de histórico</label>
              <input type="number" value={settings.max_history_days}
                onChange={(e) => settings.updateSettings({ max_history_days: Number(e.target.value) })}
                min={1} max={365} />
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="card-static p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-5">Segurança</h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-text-primary font-medium">Modo seguro</p>
                <p className="text-[11px] text-text-muted mt-0.5">Envia para lixeira ao invés de excluir</p>
              </div>
              <Toggle checked={settings.safe_mode} onChange={() => settings.updateSettings({ safe_mode: !settings.safe_mode })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] text-text-primary font-medium">Limpeza automática</p>
                <p className="text-[11px] text-text-muted mt-0.5">Limpa temporários periodicamente</p>
              </div>
              <Toggle checked={settings.auto_cleanup} onChange={() => settings.updateSettings({ auto_cleanup: !settings.auto_cleanup })} />
            </div>
          </div>
        </div>

        {/* Aparência */}
        <div className="card-static p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-5">Aparência</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] text-text-muted font-medium mb-1.5">Tema</label>
              <select value={settings.theme} onChange={(e) => settings.updateSettings({ theme: e.target.value })}>
                <option value="dark">Escuro</option>
                <option value="light">Claro</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-text-muted font-medium mb-1.5">Unidade de tamanho</label>
              <select value={settings.size_unit} onChange={(e) => settings.updateSettings({ size_unit: e.target.value })}>
                <option value="auto">Automático</option>
                <option value="KB">Kilobytes (KB)</option>
                <option value="MB">Megabytes (MB)</option>
                <option value="GB">Gigabytes (GB)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Caminhos ignorados */}
        <div className="card-static p-5">
          <h3 className="text-[13px] font-semibold text-text-primary mb-2">Caminhos Ignorados</h3>
          <p className="text-[11px] text-text-muted mb-4">Pastas ignoradas durante o scan</p>
          <div className="space-y-2">
            {settings.ignored_paths.map((path, i) => (
              <div key={i} className="flex items-center justify-between bg-bg-app rounded-lg px-3 py-2 border border-border/50">
                <span className="text-[12px] text-text-primary font-mono">{path}</span>
                <button onClick={() => settings.updateSettings({ ignored_paths: settings.ignored_paths.filter((_, idx) => idx !== i) })}
                  className="text-danger text-[11px] font-medium hover:text-danger-dark transition-colors cursor-pointer">
                  Remover
                </button>
              </div>
            ))}
            {settings.ignored_paths.length === 0 && (
              <p className="text-[12px] text-text-muted italic">Nenhum caminho ignorado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
