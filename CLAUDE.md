# TracOS — Central de Controle Tracbel Agro

## Sobre o Projeto

Aplicação desktop corporativa para monitoramento de sistema, análise de armazenamento e ações de manutenção, desenvolvida para a Tracbel Agro.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Zustand + React Router + Recharts
- **Backend**: Tauri v2 + Rust (sysinfo, walkdir, rusqlite, trash)
- **Build**: `npm run tauri dev` (desenvolvimento) / `npm run tauri build` (produção)

## Estrutura

```
src/                    # Frontend React
  components/           # Componentes reutilizáveis (layout, ui, charts)
  pages/                # Páginas (Dashboard, DiskAnalysis, etc.)
  stores/               # Zustand stores (systemStore, diskStore, settingsStore, historyStore)
  services/             # Comunicação IPC com Tauri (tauri-commands.ts)
  types/                # TypeScript interfaces (espelho dos modelos Rust)
  hooks/                # React hooks customizados
  utils/                # Utilitários de formatação

src-tauri/              # Backend Rust
  src/commands/         # Tauri commands (IPC handlers)
  src/services/         # Lógica de negócio (system_service, scan_service, file_service)
  src/models/           # Structs e enums de dados
```

## Convenções

- Comentários em português
- Código limpo sem superficialidades
- Componentes UI com classes Tailwind (tema definido em index.css via @theme)
- Cores: verde institucional (primary), cinza escuro (bg), amarelo (warning), vermelho (danger), azul (info)
- Todas as ações de exclusão passam por confirmação e modo seguro (lixeira)

## Comandos

```bash
npm run dev          # Dev server frontend
npm run tauri dev    # Dev completo (Tauri + frontend)
npm run tauri build  # Build para produção
```
