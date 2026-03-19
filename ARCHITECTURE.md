# TracOS - Central de Controle Tracbel Agro

## Documento de Arquitetura Completa

**Versão:** 1.0.0
**Data:** 19 de março de 2026
**Classificação:** Documento Interno - Tracbel Agro
**Responsável:** Equipe de Engenharia de Software

---

## Sumário

1. [Nome Final e Identidade](#1-nome-final-e-identidade)
2. [Visão do Sistema](#2-visão-do-sistema)
3. [Escopo MVP - Fase 1](#3-escopo-mvp---fase-1)
4. [Escopo Avançado - Fase 2+](#4-escopo-avançado---fase-2)
5. [Arquitetura do Sistema](#5-arquitetura-do-sistema)
6. [Estrutura de Pastas](#6-estrutura-de-pastas)
7. [Modelagem de Dados](#7-modelagem-de-dados)
8. [Estratégia de Scan de Disco](#8-estratégia-de-scan-de-disco)
9. [Estratégia de Gráficos e Visualização](#9-estratégia-de-gráficos-e-visualização)
10. [Estratégia de Limpeza](#10-estratégia-de-limpeza)
11. [Wireframes Textuais](#11-wireframes-textuais)
12. [Fluxos de Usuário](#12-fluxos-de-usuário)
13. [Roadmap de Desenvolvimento](#13-roadmap-de-desenvolvimento)

---

## 1. Nome Final e Identidade

### Nome do Produto

**TracOS - Central de Controle Tracbel Agro**

### Significado

- **Trac**: Referência direta à marca Tracbel, reforçando identidade corporativa
- **OS**: Dupla leitura — "Operating System" (sistema operacional/controle de máquina) e "Observação de Sistema"
- **Central de Controle**: Posiciona o software como painel de comando, não apenas utilitário

### Identidade Visual

| Elemento         | Especificação                                      |
|------------------|----------------------------------------------------|
| Cor Primária     | `#1B5E20` (Verde Tracbel Agro)                     |
| Cor Secundária   | `#FF6F00` (Laranja Alerta/Ação)                    |
| Cor de Fundo     | `#121212` (Dark Mode padrão) / `#FAFAFA` (Light)   |
| Cor de Sucesso   | `#2E7D32`                                          |
| Cor de Perigo    | `#C62828`                                          |
| Cor de Aviso     | `#F9A825`                                          |
| Fonte Principal  | Inter (UI) / JetBrains Mono (dados técnicos)       |
| Ícone            | Engrenagem estilizada com folha verde               |

### Tagline

> "Controle total do seu sistema. Desempenho sob medida."

---

## 2. Visão do Sistema

### O que é

O **TracOS** é uma aplicação desktop nativa de alto desempenho para monitoramento, análise e otimização de sistemas computacionais. Construído com Tauri (Rust + React), o software oferece visibilidade completa sobre o uso de disco, consumo de recursos de hardware e oportunidades de limpeza inteligente, tudo em uma interface moderna e intuitiva.

### Para quem é

| Persona               | Descrição                                                                                              | Necessidade Principal                                     |
|------------------------|--------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| **Técnico de TI**      | Profissional de suporte interno da Tracbel Agro responsável pela manutenção de estações de trabalho    | Diagnóstico rápido de problemas de espaço e desempenho    |
| **Analista de Campo**  | Colaborador que utiliza notebooks em ambientes de campo, com armazenamento limitado                     | Liberação de espaço sem risco de perda de dados            |
| **Gestor de TI**       | Coordenador de infraestrutura que precisa de visão consolidada do parque de máquinas                   | Relatórios de saúde dos sistemas e histórico de ações      |
| **Usuário Avançado**   | Colaborador com conhecimento técnico que deseja controle fino sobre seu equipamento                     | Interface poderosa com opções granulares                   |

### Vantagem Competitiva

| Aspecto                    | TracOS                                      | Alternativas de Mercado (WinDirStat, TreeSize, etc.) |
|----------------------------|---------------------------------------------|------------------------------------------------------|
| **Performance**            | Backend Rust nativo, zero overhead de GC     | C++/C# com overhead variável                         |
| **Segurança**              | Modo seguro com rollback, lixeira integrada  | Deleção direta sem rede de proteção                  |
| **Integração Corporativa** | Customizado para políticas Tracbel Agro      | Genérico, sem contexto corporativo                   |
| **Interface**              | React moderna com dark mode e responsividade | Interfaces legadas, sem design system                |
| **Monitoramento**          | CPU, RAM, Disco em tempo real com histórico  | Foco apenas em disco, sem métricas de sistema        |
| **Tamanho do Instalador**  | ~8-15 MB (Tauri)                             | 50-200 MB (Electron) ou pesado (WPF/.NET)            |
| **Consumo de Memória**     | ~30-60 MB em operação                        | 150-500 MB (Electron-based)                          |
| **Custo**                  | Solução interna, sem licenciamento           | Versões Pro pagas ou open-source sem suporte          |

### Princípios de Design

1. **Performance First**: Toda operação pesada roda no backend Rust. O frontend nunca bloqueia.
2. **Segurança por Padrão**: Modo seguro ativo, confirmações obrigatórias, rollback disponível.
3. **Transparência**: O usuário sempre sabe o que está acontecendo (progress bars, logs, status).
4. **Progressividade**: Funcionalidades avançadas são descobertas progressivamente, sem sobrecarregar.
5. **Offline First**: Nenhuma funcionalidade depende de conexão com internet.

---

## 3. Escopo MVP - Fase 1

### 3.1 Dashboard Principal

**Objetivo:** Tela de entrada que fornece uma visão panorâmica instantânea da saúde do sistema.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Prioridade |
|----------|---------------------------------|--------------------------------------------------------------------------------|------------|
| DASH-001 | Resumo de Discos                | Cards para cada disco/partição com barra de uso, espaço livre/total            | P0         |
| DASH-002 | Indicadores de CPU e RAM        | Gauge circular com percentual atual de uso                                     | P0         |
| DASH-003 | Alertas Ativos                  | Lista de alertas (disco >90%, RAM alta, etc.) com severidade                   | P0         |
| DASH-004 | Ações Rápidas                   | Botões para iniciar scan, abrir monitor, limpar temporários                    | P1         |
| DASH-005 | Última Atividade                | Log resumido das últimas 5 ações realizadas                                    | P1         |
| DASH-006 | Status do Sistema               | Uptime, hostname, versão do OS, último scan                                    | P1         |

### 3.2 Análise de Disco

**Objetivo:** Permitir scan completo de diretórios com navegação hierárquica pelo resultado.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Prioridade |
|----------|---------------------------------|--------------------------------------------------------------------------------|------------|
| DISK-001 | Seleção de Diretório            | File picker nativo do OS para escolher raiz do scan                            | P0         |
| DISK-002 | Scan Recursivo                  | Varredura completa com contagem de arquivos, pastas e tamanho                  | P0         |
| DISK-003 | Barra de Progresso              | Progress bar com porcentagem, arquivos processados, tempo estimado             | P0         |
| DISK-004 | Cancelamento de Scan            | Botão para abortar scan em andamento com limpeza de estado                     | P0         |
| DISK-005 | Tabela de Resultados            | Tabela ordenável com colunas: nome, tamanho, tipo, modificação                 | P0         |
| DISK-006 | Navegação Hierárquica           | Clique em pasta para descer na hierarquia, breadcrumb para voltar              | P0         |
| DISK-007 | Filtro por Extensão             | Dropdown para filtrar por tipo de arquivo (.log, .tmp, .bak, etc.)             | P1         |
| DISK-008 | Ordenação Multi-Coluna          | Ordenar por tamanho, data, nome, tipo                                          | P1         |

### 3.3 Monitor de Recursos

**Objetivo:** Exibir métricas de sistema em tempo real com gráficos atualizados.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Prioridade |
|----------|---------------------------------|--------------------------------------------------------------------------------|------------|
| RES-001  | Gráfico de CPU                  | Line chart com uso de CPU nos últimos 60 segundos                              | P0         |
| RES-002  | Gráfico de RAM                  | Line chart com uso de RAM nos últimos 60 segundos                              | P0         |
| RES-003  | Informações de Disco            | Barras horizontais com uso de cada partição                                    | P0         |
| RES-004  | Intervalo Configurável          | Dropdown para alterar intervalo de atualização (1s, 2s, 5s, 10s)              | P1         |
| RES-005  | Indicadores Numéricos           | Valores exatos de CPU%, RAM em GB, Disco em GB                                 | P0         |

### 3.4 Ações Básicas

**Objetivo:** Operações essenciais sobre arquivos e pastas identificados.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Prioridade |
|----------|---------------------------------|--------------------------------------------------------------------------------|------------|
| ACT-001  | Deletar Arquivo/Pasta           | Enviar para lixeira (padrão) ou deletar permanentemente                        | P0         |
| ACT-002  | Abrir no Explorer               | Abrir pasta pai no gerenciador de arquivos do OS                               | P0         |
| ACT-003  | Copiar Caminho                  | Copiar caminho completo para a área de transferência                           | P1         |
| ACT-004  | Confirmação de Deleção          | Modal de confirmação com nome, tamanho e aviso                                 | P0         |
| ACT-005  | Feedback de Ação                | Toast/snackbar com resultado da operação (sucesso/erro)                        | P0         |

### 3.5 Configurações

**Objetivo:** Permitir personalização do comportamento do aplicativo.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Prioridade |
|----------|---------------------------------|--------------------------------------------------------------------------------|------------|
| SET-001  | Intervalo de Atualização        | Slider para definir frequência de coleta de métricas (1-30s)                   | P0         |
| SET-002  | Caminhos Ignorados              | Lista editável de diretórios a serem ignorados no scan                         | P0         |
| SET-003  | Modo Seguro                     | Toggle para ativar/desativar confirmações extras e modo lixeira                | P0         |
| SET-004  | Tema                            | Seletor Dark/Light/System                                                      | P1         |
| SET-005  | Unidade de Tamanho              | Seletor: Automático, KB, MB, GB                                               | P1         |
| SET-006  | Persistência                    | Salvar configurações em arquivo local JSON                                     | P0         |

---

## 4. Escopo Avançado - Fase 2+

### 4.1 Limpeza Inteligente (Smart Cleanup)

**Objetivo:** Identificação automática de arquivos candidatos a remoção com categorização e sugestões.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Fase |
|----------|---------------------------------|--------------------------------------------------------------------------------|------|
| CLN-001  | Scan de Temporários             | Identificar arquivos em %TEMP%, caches de navegador, logs antigos              | F2   |
| CLN-002  | Detecção de Duplicatas          | Hash-based duplicate detection com agrupamento                                 | F3   |
| CLN-003  | Arquivos Antigos                | Identificar arquivos não acessados há mais de N dias (configurável)            | F2   |
| CLN-004  | Categorização                   | Agrupar sugestões: Temporários, Logs, Cache, Downloads Antigos, Duplicatas     | F2   |
| CLN-005  | Seleção em Lote                 | Checkbox para selecionar múltiplos itens, "Selecionar Todos" por categoria     | F2   |
| CLN-006  | Preview de Economia             | Mostrar total que será liberado antes de confirmar                              | F2   |
| CLN-007  | Regras Customizadas             | Permitir criar regras de limpeza (ex: "*.log > 30 dias > 100MB")              | F3   |

### 4.2 Treemap de Disco

**Objetivo:** Visualização gráfica do uso de disco em formato treemap interativo.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Fase |
|----------|---------------------------------|--------------------------------------------------------------------------------|------|
| TMP-001  | Treemap Renderizado             | Mapa de blocos proporcionais ao tamanho de cada diretório/arquivo              | F2   |
| TMP-002  | Cores por Tipo                  | Código de cores por extensão/tipo de arquivo                                   | F2   |
| TMP-003  | Zoom Interativo                 | Clique para navegar dentro de um diretório no treemap                          | F2   |
| TMP-004  | Tooltip de Detalhes             | Hover mostra nome, tamanho, tipo, data de modificação                          | F2   |
| TMP-005  | Ações Contextuais               | Clique direito para deletar, abrir no explorer, copiar caminho                 | F2   |
| TMP-006  | Animação de Transição           | Transição suave ao navegar entre níveis do treemap                             | F3   |

### 4.3 Histórico de Ações

**Objetivo:** Registro completo de todas as operações realizadas pelo sistema.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Fase |
|----------|---------------------------------|--------------------------------------------------------------------------------|------|
| HST-001  | Log de Ações                    | Registro cronológico de scans, deleções, limpezas                              | F2   |
| HST-002  | Filtro por Tipo                 | Filtrar por: Scan, Deleção, Limpeza, Configuração                              | F2   |
| HST-003  | Filtro por Data                 | Date picker para filtrar período                                               | F2   |
| HST-004  | Detalhes da Ação                | Expandir linha para ver detalhes completos (tamanho, caminho, resultado)        | F2   |
| HST-005  | Exportar Relatório              | Exportar histórico em CSV ou JSON                                              | F3   |
| HST-006  | Rollback                        | Reverter ação de deleção (se enviado para lixeira)                             | F2   |

### 4.4 Central de Ajuda

**Objetivo:** Documentação integrada e guias contextuais.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Fase |
|----------|---------------------------------|--------------------------------------------------------------------------------|------|
| HLP-001  | Guia de Funcionalidades         | Documentação de cada tela com screenshots e instruções                          | F3   |
| HLP-002  | Tooltips Contextuais            | Ícones de "?" com explicações inline                                           | F2   |
| HLP-003  | Tour Guiado                     | Onboarding interativo no primeiro uso                                          | F3   |
| HLP-004  | FAQ                             | Perguntas frequentes com busca                                                 | F3   |
| HLP-005  | Atalhos de Teclado              | Lista de atalhos e referência rápida                                           | F3   |

### 4.5 Limpeza Automática (Auto-Cleanup)

**Objetivo:** Agendamento de limpezas recorrentes baseadas em regras.

**Funcionalidades:**

| ID       | Funcionalidade                  | Descrição                                                                      | Fase |
|----------|---------------------------------|--------------------------------------------------------------------------------|------|
| AUT-001  | Agendamento                     | Configurar limpeza diária, semanal ou mensal                                   | F3   |
| AUT-002  | Regras de Limpeza               | Definir critérios: extensão, idade, tamanho, localização                       | F3   |
| AUT-003  | Notificação Prévia              | Notificar antes de executar limpeza agendada                                   | F3   |
| AUT-004  | Relatório Pós-Limpeza           | Resumo do que foi limpo com opção de rollback                                  | F3   |
| AUT-005  | Limites de Segurança            | Não limpar mais que N GB por execução, skip se disco >50% livre                | F4   |

---

## 5. Arquitetura do Sistema

### 5.1 Visão Geral da Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TracOS Application                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    FRONTEND (WebView)                        │   │
│  │                                                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │
│  │  │  React   │  │  Zustand  │  │ Recharts │  │  Radix   │    │   │
│  │  │  18.x    │  │  State   │  │  Charts  │  │   UI     │    │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │
│  │  │  TypeScript │ TailwindCSS│ │React Router│ │Lucide Icons│  │   │
│  │  │  5.x     │  │  3.x     │  │  6.x     │  │          │    │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │   │
│  │                                                              │   │
│  └──────────────────────┬───────────────────────────────────────┘   │
│                         │                                           │
│                    Tauri IPC                                        │
│               (invoke / events)                                     │
│                         │                                           │
│  ┌──────────────────────┴───────────────────────────────────────┐   │
│  │                    BACKEND (Rust Native)                      │   │
│  │                                                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │
│  │  │  Tauri   │  │  sysinfo  │  │  walkdir  │  │  serde   │    │   │
│  │  │  2.x     │  │  crate   │  │  crate   │  │  json    │    │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │
│  │  │  tokio   │  │  rayon   │  │  SQLite  │  │  trash   │    │   │
│  │  │  async   │  │  parallel│  │  rusqlite│  │  crate   │    │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                   Sistema Operacional (Windows)                     │
│         ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│         │   File   │  │  WMI /   │  │  Shell   │                   │
│         │  System  │  │ PerfMon  │  │  APIs    │                   │
│         └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Arquitetura em Camadas Detalhada

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CAMADA DE APRESENTAÇÃO                         │
│                                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   Pages/     │ │  Components/ │ │   Hooks/     │ │   Stores/    │   │
│  │   Views      │ │  UI Kit      │ │   Custom     │ │   Zustand    │   │
│  │              │ │              │ │              │ │              │   │
│  │ Dashboard    │ │ Card         │ │ useScan      │ │ scanStore    │   │
│  │ DiskAnalysis │ │ Chart        │ │ useMetrics   │ │ metricsStore │   │
│  │ Treemap      │ │ Table        │ │ useCleanup   │ │ cleanupStore │   │
│  │ Resources    │ │ Modal        │ │ useSettings  │ │ settingsStore│   │
│  │ Cleanup      │ │ Progress     │ │ useHistory   │ │ historyStore │   │
│  │ History      │ │ Alert        │ │ useToast     │ │ uiStore      │   │
│  │ Settings     │ │ Sidebar      │ │ useIPC       │ │              │   │
│  │ Help         │ │ Breadcrumb   │ │              │ │              │   │
│  └──────┬───────┘ └──────────────┘ └──────┬───────┘ └──────┬───────┘   │
│         │                                  │                │           │
│         └──────────────────┬───────────────┘                │           │
│                            │                                │           │
│  ┌─────────────────────────┴────────────────────────────────┴───────┐   │
│  │                      CAMADA DE SERVIÇOS (TS)                     │   │
│  │                                                                   │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │   │
│  │  │  ipc.service │ │  format.util │ │  validate.   │              │   │
│  │  │              │ │              │ │  util        │              │   │
│  │  │ invoke()     │ │ formatSize() │ │ isValidPath()│              │   │
│  │  │ listen()     │ │ formatDate() │ │ sanitize()   │              │   │
│  │  │ emit()       │ │ formatPerc() │ │              │              │   │
│  │  └──────┬───────┘ └──────────────┘ └──────────────┘              │   │
│  │         │                                                         │   │
│  └─────────┼─────────────────────────────────────────────────────────┘   │
│            │                                                             │
└────────────┼─────────────────────────────────────────────────────────────┘
             │
     ════════╪════════  TAURI IPC BRIDGE  ════════════════════════════
             │          (JSON Serialization / Deserialization)
             │          Commands: invoke("command_name", {payload})
             │          Events:   listen("event_name", callback)
             │
┌────────────┼─────────────────────────────────────────────────────────────┐
│            │                                                             │
│  ┌─────────┴─────────────────────────────────────────────────────────┐   │
│  │                    CAMADA DE COMANDOS (Rust)                       │   │
│  │                                                                   │   │
│  │  #[tauri::command]                                                │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │   │
│  │  │ scan_cmds    │ │ metrics_cmds │ │ cleanup_cmds │              │   │
│  │  │              │ │              │ │              │              │   │
│  │  │ start_scan() │ │ get_metrics()│ │ delete_item()│              │   │
│  │  │ cancel_scan()│ │ get_disks()  │ │ smart_clean()│              │   │
│  │  │ get_results()│ │ get_history()│ │ rollback()   │              │   │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘              │   │
│  │         │                │                │                       │   │
│  │  ┌──────┴────────┐ ┌────┴──────────┐ ┌───┴───────────┐          │   │
│  │  │ settings_cmds │ │ history_cmds  │ │ system_cmds   │          │   │
│  │  │               │ │               │ │               │          │   │
│  │  │ get_settings()│ │ get_logs()    │ │ open_explorer │          │   │
│  │  │ save_settings │ │ export_logs() │ │ get_sys_info()│          │   │
│  │  └──────┬────────┘ └──────┬────────┘ └──────┬────────┘          │   │
│  │         │                  │                  │                   │   │
│  └─────────┼──────────────────┼──────────────────┼───────────────────┘   │
│            │                  │                  │                       │
│  ┌─────────┴──────────────────┴──────────────────┴───────────────────┐   │
│  │                   CAMADA DE SERVIÇOS (Rust)                       │   │
│  │                                                                   │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │   │
│  │  │ ScanService  │ │MetricsService│ │CleanupService│              │   │
│  │  │              │ │              │ │              │              │   │
│  │  │ walk_dir()   │ │ collect()    │ │ analyze()    │              │   │
│  │  │ build_tree() │ │ snapshot()   │ │ execute()    │              │   │
│  │  │ calculate()  │ │ aggregate()  │ │ revert()     │              │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘              │   │
│  │  ┌──────────────┐ ┌──────────────┐                               │   │
│  │  │ StorageService│ │ LogService   │                               │   │
│  │  │              │ │              │                               │   │
│  │  │ save()       │ │ info()       │                               │   │
│  │  │ load()       │ │ warn()       │                               │   │
│  │  │ query()      │ │ error()      │                               │   │
│  │  └──────────────┘ └──────────────┘                               │   │
│  │                                                                   │   │
│  └───────────────────────────┬───────────────────────────────────────┘   │
│                              │                                           │
│                    CAMADA DE INFRAESTRUTURA                              │
│                                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   SQLite     │ │   sysinfo    │ │   walkdir    │ │   trash      │   │
│  │   Database   │ │   OS APIs    │ │   File I/O   │ │   Recycle    │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                                         │
│                          BACKEND RUST NATIVO                            │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Fluxo de Comunicação IPC

```
Frontend (React)                    Tauri IPC                    Backend (Rust)
      │                                │                              │
      │  invoke("start_scan",          │                              │
      │         {path: "C:\\"})        │                              │
      ├───────────────────────────────►│  #[tauri::command]           │
      │                                ├─────────────────────────────►│
      │                                │  fn start_scan(path)         │
      │                                │                              │
      │                                │         Spawn async task     │
      │                                │◄─────────────────────────────┤
      │  Result<ScanJob>               │  Return ScanJob (id, status) │
      │◄───────────────────────────────┤                              │
      │                                │                              │
      │  listen("scan_progress")       │                              │
      │◄ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤  emit("scan_progress",      │
      │                                │◄─────────────────────────────┤
      │  {scanned: 1500,               │       {scanned, total,       │
      │   total: 50000,                │        current_path})        │
      │   current: "C:\\Users\\..."}   │                              │
      │                                │                              │
      │  listen("scan_progress")       │                              │
      │◄ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤  emit("scan_progress", ...) │
      │                                │◄─────────────────────────────┤
      │       ... (N events) ...       │                              │
      │                                │                              │
      │  listen("scan_complete")       │                              │
      │◄ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤  emit("scan_complete",      │
      │                                │◄─────────────────────────────┤
      │  {job_id, total_size,          │       {job_id, results})     │
      │   total_files, duration}       │                              │
      │                                │                              │
      │  invoke("get_scan_tree",       │                              │
      │         {job_id, depth: 2})    │                              │
      ├───────────────────────────────►│                              │
      │                                ├─────────────────────────────►│
      │  Result<Vec<DirectoryNode>>    │  Query cached results        │
      │◄───────────────────────────────┤◄─────────────────────────────┤
      │                                │                              │
```

### 5.4 Comandos IPC Completos

| Comando                     | Direção       | Payload de Entrada                           | Payload de Saída                       | Tipo       |
|-----------------------------|---------------|----------------------------------------------|----------------------------------------|------------|
| `start_scan`                | FE → BE       | `{ path: string }`                           | `Result<ScanJob>`                      | Command    |
| `cancel_scan`               | FE → BE       | `{ job_id: string }`                         | `Result<()>`                           | Command    |
| `get_scan_tree`             | FE → BE       | `{ job_id: string, path?: string, depth: u32 }` | `Result<Vec<DirectoryNode>>`       | Command    |
| `get_largest_files`         | FE → BE       | `{ job_id: string, limit: u32 }`             | `Result<Vec<FileItem>>`               | Command    |
| `get_system_metrics`        | FE → BE       | `{}`                                         | `Result<SystemMetric>`                 | Command    |
| `get_disk_info`             | FE → BE       | `{}`                                         | `Result<Vec<DiskInfo>>`                | Command    |
| `get_resource_history`      | FE → BE       | `{ minutes: u32 }`                           | `Result<Vec<ResourceHistory>>`         | Command    |
| `delete_item`               | FE → BE       | `{ path: string, to_trash: bool }`           | `Result<CleanupAction>`                | Command    |
| `smart_cleanup_scan`        | FE → BE       | `{ categories: Vec<string> }`               | `Result<Vec<FileItem>>`               | Command    |
| `execute_cleanup`           | FE → BE       | `{ items: Vec<string>, to_trash: bool }`     | `Result<Vec<CleanupAction>>`           | Command    |
| `rollback_action`           | FE → BE       | `{ action_id: string }`                      | `Result<()>`                           | Command    |
| `get_settings`              | FE → BE       | `{}`                                         | `Result<UserSettings>`                 | Command    |
| `save_settings`             | FE → BE       | `UserSettings`                               | `Result<()>`                           | Command    |
| `get_action_history`        | FE → BE       | `{ from?: string, to?: string, type?: string }` | `Result<Vec<CleanupAction>>`      | Command    |
| `get_logs`                  | FE → BE       | `{ level?: string, limit: u32 }`             | `Result<Vec<AppLog>>`                  | Command    |
| `open_in_explorer`          | FE → BE       | `{ path: string }`                           | `Result<()>`                           | Command    |
| `get_system_info`           | FE → BE       | `{}`                                         | `Result<SystemInfo>`                   | Command    |
| `scan_progress`             | BE → FE       | —                                            | `{ scanned, total, current_path }`     | Event      |
| `scan_complete`             | BE → FE       | —                                            | `{ job_id, total_size, total_files }`  | Event      |
| `scan_error`                | BE → FE       | —                                            | `{ job_id, error_message }`            | Event      |
| `metrics_update`            | BE → FE       | —                                            | `SystemMetric`                         | Event      |
| `cleanup_progress`          | BE → FE       | —                                            | `{ processed, total, current_path }`   | Event      |

### 5.5 Dependências Técnicas

#### Frontend (package.json)

| Pacote                  | Versão    | Propósito                                  |
|-------------------------|-----------|--------------------------------------------|
| `react`                 | ^18.3     | Biblioteca de UI                           |
| `react-dom`             | ^18.3     | Renderização DOM                           |
| `react-router-dom`      | ^6.20     | Roteamento SPA                             |
| `@tauri-apps/api`       | ^2.0      | Bridge IPC com backend Rust                |
| `zustand`               | ^4.5      | Gerenciamento de estado                    |
| `recharts`              | ^2.10     | Gráficos (line, bar, area, pie)            |
| `@radix-ui/react-*`     | latest    | Primitivos de UI acessíveis                |
| `tailwindcss`           | ^3.4      | Framework CSS utility-first                |
| `lucide-react`          | ^0.300    | Ícone set consistente                      |
| `clsx`                  | ^2.1      | Utility para class names condicionais      |
| `date-fns`              | ^3.0      | Formatação e manipulação de datas          |
| `typescript`            | ^5.3      | Type safety                                |
| `vite`                  | ^5.0      | Build tool e dev server                    |

#### Backend (Cargo.toml)

| Crate                   | Versão    | Propósito                                  |
|-------------------------|-----------|--------------------------------------------|
| `tauri`                 | ^2.0      | Framework desktop                          |
| `serde`                 | ^1.0      | Serialização/Desserialização               |
| `serde_json`            | ^1.0      | JSON handling                              |
| `tokio`                 | ^1.35     | Runtime assíncrono                         |
| `sysinfo`               | ^0.30     | Informações de CPU, RAM, disco             |
| `walkdir`               | ^2.4      | Travessia recursiva de diretórios          |
| `rayon`                 | ^1.8      | Paralelismo de dados                       |
| `rusqlite`              | ^0.31     | SQLite embarcado                           |
| `uuid`                  | ^1.6      | Geração de IDs únicos                     |
| `chrono`                | ^0.4      | Manipulação de datas                       |
| `trash`                 | ^3.3      | Envio para lixeira do OS                   |
| `log`                   | ^0.4      | Logging facade                             |
| `env_logger`            | ^0.10     | Implementação de logging                   |
| `thiserror`             | ^1.0      | Error handling ergonômico                  |
| `directories`           | ^5.0      | Caminhos de dados do app                   |
| `sha2`                  | ^0.10     | Hash para detecção de duplicatas (F3)      |

---

## 6. Estrutura de Pastas

```
TracOS/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI: lint, test, build
│       └── release.yml               # Build de release com assinatura
│
├── docs/
│   ├── ARCHITECTURE.md               # Este documento
│   ├── CONTRIBUTING.md               # Guia de contribuição
│   ├── CHANGELOG.md                  # Registro de mudanças
│   └── screenshots/                  # Screenshots para documentação
│
├── src-tauri/                        # ══════ BACKEND RUST ══════
│   ├── Cargo.toml                    # Dependências Rust
│   ├── Cargo.lock                    # Lock file
│   ├── tauri.conf.json               # Configuração do Tauri
│   ├── build.rs                      # Build script
│   ├── icons/                        # Ícones da aplicação
│   │   ├── icon.ico                  # Windows icon
│   │   ├── icon.png                  # PNG 512x512
│   │   ├── 32x32.png
│   │   ├── 128x128.png
│   │   └── 128x128@2x.png
│   │
│   └── src/
│       ├── main.rs                   # Entry point, setup, plugin registration
│       ├── lib.rs                    # Module declarations
│       ├── error.rs                  # Error types centralizados (TracOSError)
│       ├── state.rs                  # AppState (managed state compartilhado)
│       │
│       ├── commands/                 # Camada de comandos Tauri (IPC handlers)
│       │   ├── mod.rs                # Re-exports de todos os módulos
│       │   ├── scan_commands.rs      # start_scan, cancel_scan, get_scan_tree
│       │   ├── metrics_commands.rs   # get_system_metrics, get_disk_info
│       │   ├── cleanup_commands.rs   # delete_item, smart_cleanup, rollback
│       │   ├── settings_commands.rs  # get_settings, save_settings
│       │   ├── history_commands.rs   # get_action_history, get_logs, export
│       │   └── system_commands.rs    # open_in_explorer, get_system_info
│       │
│       ├── services/                 # Lógica de negócio
│       │   ├── mod.rs
│       │   ├── scan_service.rs       # Lógica de varredura de diretórios
│       │   ├── metrics_service.rs    # Coleta de métricas do sistema
│       │   ├── cleanup_service.rs    # Lógica de limpeza e deleção
│       │   ├── storage_service.rs    # Persistência SQLite
│       │   ├── settings_service.rs   # Leitura/escrita de configurações
│       │   ├── log_service.rs        # Sistema de logging
│       │   └── scheduler_service.rs  # Agendamento de tarefas (F3)
│       │
│       ├── models/                   # Structs e tipos de dados
│       │   ├── mod.rs
│       │   ├── scan.rs               # ScanJob, DirectoryNode, FileItem
│       │   ├── metrics.rs            # SystemMetric, DiskInfo, ResourceHistory
│       │   ├── cleanup.rs            # CleanupAction, CleanupCategory
│       │   ├── settings.rs           # UserSettings
│       │   └── log.rs                # AppLog
│       │
│       ├── db/                       # Camada de banco de dados
│       │   ├── mod.rs
│       │   ├── migrations.rs         # Schema e migrações SQL
│       │   ├── scan_repo.rs          # Queries de scan
│       │   ├── metrics_repo.rs       # Queries de métricas
│       │   ├── cleanup_repo.rs       # Queries de cleanup
│       │   └── log_repo.rs           # Queries de log
│       │
│       └── utils/                    # Utilidades compartilhadas
│           ├── mod.rs
│           ├── file_utils.rs         # Helpers de filesystem
│           ├── format_utils.rs       # Formatação de tamanhos, datas
│           └── hash_utils.rs         # Cálculo de hashes (F3)
│
├── src/                              # ══════ FRONTEND REACT ══════
│   ├── main.tsx                      # Entry point React
│   ├── App.tsx                       # Root component, Router setup
│   ├── vite-env.d.ts                 # Vite type declarations
│   │
│   ├── assets/                       # Recursos estáticos
│   │   ├── logo.svg                  # Logo TracOS
│   │   └── fonts/                    # Fontes customizadas (se aplicável)
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── ui/                       # Design System base
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── index.ts             # Barrel export
│   │   │
│   │   ├── layout/                   # Componentes de layout
│   │   │   ├── Sidebar.tsx           # Menu lateral principal
│   │   │   ├── Header.tsx            # Barra superior
│   │   │   ├── MainLayout.tsx        # Layout wrapper
│   │   │   └── PageContainer.tsx     # Container padrão de página
│   │   │
│   │   ├── charts/                   # Componentes de gráficos
│   │   │   ├── CpuChart.tsx          # Gráfico de CPU
│   │   │   ├── RamChart.tsx          # Gráfico de RAM
│   │   │   ├── DiskUsageBar.tsx      # Barra de uso de disco
│   │   │   ├── DiskTreemap.tsx       # Treemap de disco
│   │   │   ├── GaugeCircle.tsx       # Gauge circular
│   │   │   └── HistoryChart.tsx      # Gráfico de histórico
│   │   │
│   │   ├── dashboard/                # Componentes do Dashboard
│   │   │   ├── DiskSummaryCard.tsx
│   │   │   ├── SystemStatusCard.tsx
│   │   │   ├── AlertsList.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── RecentActivity.tsx
│   │   │
│   │   ├── scan/                     # Componentes de Scan
│   │   │   ├── ScanControls.tsx
│   │   │   ├── ScanProgress.tsx
│   │   │   ├── DirectoryTable.tsx
│   │   │   ├── FileTable.tsx
│   │   │   └── PathBreadcrumb.tsx
│   │   │
│   │   ├── cleanup/                  # Componentes de Limpeza
│   │   │   ├── CleanupCategories.tsx
│   │   │   ├── CleanupItemList.tsx
│   │   │   ├── CleanupSummary.tsx
│   │   │   └── ConfirmCleanupModal.tsx
│   │   │
│   │   └── common/                   # Componentes genéricos
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── pages/                        # Páginas (rotas)
│   │   ├── DashboardPage.tsx
│   │   ├── DiskAnalysisPage.tsx
│   │   ├── TreemapPage.tsx
│   │   ├── LargestFilesPage.tsx
│   │   ├── ResourceMonitorPage.tsx
│   │   ├── SmartCleanupPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── HelpPage.tsx
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useScan.ts                # Hook para operações de scan
│   │   ├── useMetrics.ts             # Hook para métricas em tempo real
│   │   ├── useCleanup.ts             # Hook para operações de limpeza
│   │   ├── useSettings.ts            # Hook para configurações
│   │   ├── useHistory.ts             # Hook para histórico
│   │   ├── useToast.ts               # Hook para notificações toast
│   │   ├── useIPC.ts                 # Hook genérico para IPC calls
│   │   ├── useInterval.ts            # Hook para polling com intervalo
│   │   └── useTheme.ts               # Hook para tema dark/light
│   │
│   ├── stores/                       # Estado global (Zustand)
│   │   ├── scanStore.ts              # Estado de scan
│   │   ├── metricsStore.ts           # Estado de métricas
│   │   ├── cleanupStore.ts           # Estado de limpeza
│   │   ├── settingsStore.ts          # Estado de configurações
│   │   ├── historyStore.ts           # Estado de histórico
│   │   └── uiStore.ts               # Estado de UI (sidebar, modals, toasts)
│   │
│   ├── services/                     # Camada de serviço (abstração IPC)
│   │   ├── ipc.ts                    # Wrapper genérico do Tauri invoke/listen
│   │   ├── scanService.ts            # Serviço de scan
│   │   ├── metricsService.ts         # Serviço de métricas
│   │   ├── cleanupService.ts         # Serviço de limpeza
│   │   ├── settingsService.ts        # Serviço de configurações
│   │   └── historyService.ts         # Serviço de histórico
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── scan.ts                   # ScanJob, DirectoryNode, FileItem
│   │   ├── metrics.ts                # SystemMetric, DiskInfo, ResourceHistory
│   │   ├── cleanup.ts                # CleanupAction, CleanupCategory
│   │   ├── settings.ts               # UserSettings
│   │   ├── log.ts                    # AppLog
│   │   └── ipc.ts                    # IPC request/response types
│   │
│   ├── utils/                        # Utilidades frontend
│   │   ├── format.ts                 # Formatação de bytes, datas, percentuais
│   │   ├── constants.ts              # Constantes da aplicação
│   │   ├── colors.ts                 # Paleta de cores para gráficos
│   │   └── validators.ts             # Validações de input
│   │
│   └── styles/                       # Estilos globais
│       ├── globals.css               # Reset, variáveis CSS, estilos base
│       └── tailwind.css              # Importação do Tailwind
│
├── public/                           # Arquivos estáticos públicos
│   └── favicon.ico
│
├── tests/                            # Testes
│   ├── frontend/
│   │   ├── components/               # Testes de componentes
│   │   ├── hooks/                    # Testes de hooks
│   │   └── utils/                    # Testes de utilitários
│   └── backend/
│       ├── services/                 # Testes de serviços Rust
│       └── integration/              # Testes de integração
│
├── .gitignore
├── .eslintrc.json                    # Configuração ESLint
├── .prettierrc                       # Configuração Prettier
├── tsconfig.json                     # TypeScript config
├── tsconfig.node.json                # TypeScript config para Node
├── tailwind.config.js                # Configuração Tailwind CSS
├── postcss.config.js                 # PostCSS config
├── vite.config.ts                    # Vite config
├── package.json                      # Dependências frontend
├── package-lock.json
└── README.md                         # Documentação do projeto
```

---

## 7. Modelagem de Dados

### 7.1 ScanJob

Representa uma sessão de varredura de disco. Cada vez que o usuário inicia um scan, um novo `ScanJob` é criado.

**Rust Struct:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanJob {
    /// Identificador único da sessão de scan (UUID v4)
    pub id: String,

    /// Caminho raiz selecionado para o scan (ex: "C:\\Users")
    pub root_path: String,

    /// Status atual do scan
    pub status: ScanStatus,

    /// Timestamp de início do scan (ISO 8601)
    pub started_at: String,

    /// Timestamp de finalização (None se ainda em andamento)
    pub finished_at: Option<String>,

    /// Tamanho total em bytes de todos os arquivos escaneados
    pub total_size: u64,

    /// Número total de arquivos encontrados
    pub total_files: u64,

    /// Número total de diretórios encontrados
    pub total_dirs: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ScanStatus {
    Pending,
    Running,
    Completed,
    Cancelled,
    Error,
}
```

**TypeScript Interface:**

```typescript
interface ScanJob {
  id: string;                    // UUID v4
  root_path: string;             // Ex: "C:\\Users"
  status: ScanStatus;            // "pending" | "running" | "completed" | "cancelled" | "error"
  started_at: string;            // ISO 8601 timestamp
  finished_at: string | null;    // null se em andamento
  total_size: number;            // Bytes totais
  total_files: number;           // Contagem de arquivos
  total_dirs: number;            // Contagem de diretórios
}

type ScanStatus = "pending" | "running" | "completed" | "cancelled" | "error";
```

**Tabela SQLite:**

```sql
CREATE TABLE scan_jobs (
    id            TEXT PRIMARY KEY,
    root_path     TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending',
    started_at    TEXT NOT NULL,
    finished_at   TEXT,
    total_size    INTEGER NOT NULL DEFAULT 0,
    total_files   INTEGER NOT NULL DEFAULT 0,
    total_dirs    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_scan_jobs_status ON scan_jobs(status);
CREATE INDEX idx_scan_jobs_started ON scan_jobs(started_at);
```

---

### 7.2 DirectoryNode

Representa um nó na árvore de diretórios resultante de um scan. Usado para navegação hierárquica e treemap.

**Rust Struct:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DirectoryNode {
    /// Caminho completo do diretório
    pub path: String,

    /// Nome do diretório (último segmento do caminho)
    pub name: String,

    /// Tamanho total em bytes (soma recursiva de todos os arquivos filhos)
    pub size: u64,

    /// Número de filhos diretos (arquivos + subdiretórios)
    pub children_count: u32,

    /// Profundidade na árvore (0 = raiz do scan)
    pub depth: u32,

    /// Caminho do diretório pai (None para a raiz)
    pub parent_path: Option<String>,
}
```

**TypeScript Interface:**

```typescript
interface DirectoryNode {
  path: string;                  // Caminho completo
  name: string;                  // Nome do diretório
  size: number;                  // Tamanho total em bytes
  children_count: number;        // Filhos diretos
  depth: number;                 // Profundidade na árvore
  parent_path: string | null;    // Caminho do pai
}
```

**Tabela SQLite:**

```sql
CREATE TABLE directory_nodes (
    path            TEXT NOT NULL,
    scan_job_id     TEXT NOT NULL,
    name            TEXT NOT NULL,
    size            INTEGER NOT NULL DEFAULT 0,
    children_count  INTEGER NOT NULL DEFAULT 0,
    depth           INTEGER NOT NULL DEFAULT 0,
    parent_path     TEXT,

    PRIMARY KEY (path, scan_job_id),
    FOREIGN KEY (scan_job_id) REFERENCES scan_jobs(id) ON DELETE CASCADE
);

CREATE INDEX idx_dir_nodes_parent ON directory_nodes(parent_path, scan_job_id);
CREATE INDEX idx_dir_nodes_size ON directory_nodes(size DESC);
CREATE INDEX idx_dir_nodes_depth ON directory_nodes(depth);
```

---

### 7.3 FileItem

Representa um arquivo individual encontrado durante o scan. Contém metadados para análise, filtragem e limpeza.

**Rust Struct:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileItem {
    /// Caminho completo do arquivo
    pub path: String,

    /// Nome do arquivo com extensão
    pub name: String,

    /// Tamanho em bytes
    pub size: u64,

    /// Extensão do arquivo (sem ponto, lowercase), ex: "log", "tmp"
    pub extension: Option<String>,

    /// Data da última modificação (ISO 8601)
    pub modified_at: String,

    /// Se é um arquivo temporário (baseado em extensão e localização)
    pub is_temp: bool,

    /// Se é um arquivo antigo (não modificado há mais de N dias, configurável)
    pub is_old: bool,
}
```

**TypeScript Interface:**

```typescript
interface FileItem {
  path: string;                  // Caminho completo
  name: string;                  // Nome com extensão
  size: number;                  // Bytes
  extension: string | null;      // Ex: "log", "tmp", "docx"
  modified_at: string;           // ISO 8601
  is_temp: boolean;              // Flag de temporário
  is_old: boolean;               // Flag de arquivo antigo
}
```

**Tabela SQLite:**

```sql
CREATE TABLE file_items (
    path            TEXT NOT NULL,
    scan_job_id     TEXT NOT NULL,
    name            TEXT NOT NULL,
    size            INTEGER NOT NULL DEFAULT 0,
    extension       TEXT,
    modified_at     TEXT NOT NULL,
    is_temp         INTEGER NOT NULL DEFAULT 0,
    is_old          INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (path, scan_job_id),
    FOREIGN KEY (scan_job_id) REFERENCES scan_jobs(id) ON DELETE CASCADE
);

CREATE INDEX idx_files_ext ON file_items(extension, scan_job_id);
CREATE INDEX idx_files_size ON file_items(size DESC);
CREATE INDEX idx_files_temp ON file_items(is_temp) WHERE is_temp = 1;
CREATE INDEX idx_files_old ON file_items(is_old) WHERE is_old = 1;
CREATE INDEX idx_files_modified ON file_items(modified_at);
```

---

### 7.4 SystemMetric

Snapshot instantâneo das métricas do sistema operacional. Coletado em intervalos regulares pelo backend.

**Rust Struct:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMetric {
    /// Timestamp da coleta (ISO 8601)
    pub timestamp: String,

    /// Percentual de uso de CPU (0.0 a 100.0)
    pub cpu_percent: f32,

    /// RAM utilizada em bytes
    pub ram_used: u64,

    /// RAM total disponível em bytes
    pub ram_total: u64,

    /// Informações de cada disco/partição
    pub disks: Vec<DiskInfo>,
}
```

**TypeScript Interface:**

```typescript
interface SystemMetric {
  timestamp: string;             // ISO 8601
  cpu_percent: number;           // 0.0 - 100.0
  ram_used: number;              // Bytes
  ram_total: number;             // Bytes
  disks: DiskInfo[];             // Array de discos
}
```

---

### 7.5 DiskInfo

Informações de uma partição/disco individual.

**Rust Struct:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiskInfo {
    /// Nome/label do disco (ex: "Windows", "Data")
    pub name: String,

    /// Ponto de montagem (ex: "C:\\", "D:\\")
    pub mount_point: String,

    /// Espaço total em bytes
    pub total_space: u64,

    /// Espaço utilizado em bytes
    pub used_space: u64,

    /// Espaço disponível em bytes
    pub available_space: u64,

    /// Tipo de sistema de arquivos (ex: "NTFS", "FAT32", "exFAT")
    pub fs_type: String,
}
```

**TypeScript Interface:**

```typescript
interface DiskInfo {
  name: string;                  // Label do disco
  mount_point: string;           // Ex: "C:\\"
  total_space: number;           // Bytes
  used_space: number;            // Bytes
  available_space: number;       // Bytes
  fs_type: string;               // Ex: "NTFS"
}
```

---

### 7.6 ResourceHistory

Registro histórico de métricas de sistema para gráficos temporais e análise de tendências.

**Rust Struct:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceHistory {
    /// Identificador único do registro
    pub id: String,

    /// Timestamp da coleta (ISO 8601)
    pub timestamp: String,

    /// Percentual de CPU no momento da coleta
    pub cpu: f32,

    /// Percentual de RAM utilizada no momento da coleta
    pub ram: f32,

    /// Bytes lidos de disco no intervalo (I/O read)
    pub disk_io_read: u64,

    /// Bytes escritos em disco no intervalo (I/O write)
    pub disk_io_write: u64,
}
```

**TypeScript Interface:**

```typescript
interface ResourceHistory {
  id: string;                    // UUID
  timestamp: string;             // ISO 8601
  cpu: number;                   // 0.0 - 100.0
  ram: number;                   // 0.0 - 100.0 (percentual)
  disk_io_read: number;          // Bytes/s
  disk_io_write: number;         // Bytes/s
}
```

**Tabela SQLite:**

```sql
CREATE TABLE resource_history (
    id              TEXT PRIMARY KEY,
    timestamp       TEXT NOT NULL,
    cpu             REAL NOT NULL,
    ram             REAL NOT NULL,
    disk_io_read    INTEGER NOT NULL DEFAULT 0,
    disk_io_write   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_resource_ts ON resource_history(timestamp);

-- Política de retenção: manter apenas últimas 24h de dados por segundo,
-- e dados agregados (por minuto) para até 30 dias.
```

---

### 7.7 CleanupAction

Registra cada operação de limpeza/deleção realizada, permitindo auditoria e rollback.

**Rust Struct:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CleanupAction {
    /// Identificador único da ação
    pub id: String,

    /// Tipo da ação realizada
    pub action_type: ActionType,

    /// Caminho do arquivo/diretório alvo
    pub target_path: String,

    /// Quantidade de bytes liberados
    pub size_freed: u64,

    /// Timestamp da execução (ISO 8601)
    pub timestamp: String,

    /// Status da ação
    pub status: ActionStatus,

    /// Se a ação foi revertida (rollback)
    pub reverted: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ActionType {
    DeleteToTrash,
    DeletePermanent,
    SmartCleanup,
    AutoCleanup,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ActionStatus {
    Pending,
    Success,
    Failed,
    Reverted,
}
```

**TypeScript Interface:**

```typescript
interface CleanupAction {
  id: string;                    // UUID
  action_type: ActionType;       // Tipo da ação
  target_path: string;           // Caminho alvo
  size_freed: number;            // Bytes liberados
  timestamp: string;             // ISO 8601
  status: ActionStatus;          // Status
  reverted: boolean;             // Se foi revertida
}

type ActionType = "delete_to_trash" | "delete_permanent" | "smart_cleanup" | "auto_cleanup";
type ActionStatus = "pending" | "success" | "failed" | "reverted";
```

**Tabela SQLite:**

```sql
CREATE TABLE cleanup_actions (
    id              TEXT PRIMARY KEY,
    action_type     TEXT NOT NULL,
    target_path     TEXT NOT NULL,
    size_freed      INTEGER NOT NULL DEFAULT 0,
    timestamp       TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending',
    reverted        INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_cleanup_ts ON cleanup_actions(timestamp);
CREATE INDEX idx_cleanup_type ON cleanup_actions(action_type);
CREATE INDEX idx_cleanup_status ON cleanup_actions(status);
```

---

### 7.8 UserSettings

Configurações persistentes do usuário. Armazenadas em arquivo JSON no diretório de dados da aplicação.

**Rust Struct:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserSettings {
    /// Intervalo de atualização das métricas em segundos (1-30)
    pub update_interval: u32,

    /// Lista de caminhos a serem ignorados durante scans
    pub ignored_paths: Vec<String>,

    /// Modo seguro ativo (confirmações extras, lixeira obrigatória)
    pub safe_mode: bool,

    /// Tema da interface
    pub theme: Theme,

    /// Unidade de exibição de tamanhos
    pub size_unit: SizeUnit,

    /// Configuração de limpeza automática
    pub auto_cleanup: AutoCleanupConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Theme {
    Dark,
    Light,
    System,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SizeUnit {
    Auto,
    KB,
    MB,
    GB,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AutoCleanupConfig {
    /// Se a limpeza automática está habilitada
    pub enabled: bool,

    /// Frequência: "daily", "weekly", "monthly"
    pub frequency: String,

    /// Categorias habilitadas para limpeza automática
    pub categories: Vec<String>,

    /// Tamanho máximo a ser limpo por execução (em bytes, 0 = sem limite)
    pub max_size_per_run: u64,
}
```

**TypeScript Interface:**

```typescript
interface UserSettings {
  update_interval: number;       // Segundos (1-30)
  ignored_paths: string[];       // Caminhos ignorados
  safe_mode: boolean;            // Modo seguro
  theme: Theme;                  // "dark" | "light" | "system"
  size_unit: SizeUnit;           // "auto" | "kb" | "mb" | "gb"
  auto_cleanup: AutoCleanupConfig;
}

type Theme = "dark" | "light" | "system";
type SizeUnit = "auto" | "kb" | "mb" | "gb";

interface AutoCleanupConfig {
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly";
  categories: string[];
  max_size_per_run: number;      // Bytes, 0 = sem limite
}
```

**Arquivo de Configuração (settings.json):**

```json
{
  "update_interval": 2,
  "ignored_paths": [
    "C:\\Windows",
    "C:\\Program Files",
    "C:\\Program Files (x86)"
  ],
  "safe_mode": true,
  "theme": "dark",
  "size_unit": "auto",
  "auto_cleanup": {
    "enabled": false,
    "frequency": "weekly",
    "categories": ["temp", "logs"],
    "max_size_per_run": 1073741824
  }
}
```

---

### 7.9 AppLog

Registro de log interno da aplicação para depuração e auditoria.

**Rust Struct:**

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppLog {
    /// Identificador único do log
    pub id: String,

    /// Timestamp do registro (ISO 8601)
    pub timestamp: String,

    /// Nível de severidade
    pub level: LogLevel,

    /// Mensagem descritiva do evento
    pub message: String,

    /// Contexto adicional (módulo, operação, dados extras)
    pub context: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LogLevel {
    Debug,
    Info,
    Warn,
    Error,
}
```

**TypeScript Interface:**

```typescript
interface AppLog {
  id: string;                    // UUID
  timestamp: string;             // ISO 8601
  level: LogLevel;               // "debug" | "info" | "warn" | "error"
  message: string;               // Descrição do evento
  context: string | null;        // JSON string com dados extras
}

type LogLevel = "debug" | "info" | "warn" | "error";
```

**Tabela SQLite:**

```sql
CREATE TABLE app_logs (
    id          TEXT PRIMARY KEY,
    timestamp   TEXT NOT NULL,
    level       TEXT NOT NULL,
    message     TEXT NOT NULL,
    context     TEXT
);

CREATE INDEX idx_logs_level ON app_logs(level);
CREATE INDEX idx_logs_ts ON app_logs(timestamp);

-- Política de retenção: manter máximo de 10.000 registros.
-- Ao atingir o limite, deletar os 2.000 mais antigos.
```

---

### 7.10 Diagrama de Relacionamento entre Entidades

```
┌──────────────┐       1:N       ┌──────────────────┐
│   ScanJob    │────────────────►│  DirectoryNode    │
│              │                 │                    │
│ id (PK)      │                 │ path (PK)          │
│ root_path    │                 │ scan_job_id (FK)   │
│ status       │                 │ name               │
│ started_at   │                 │ size               │
│ finished_at  │                 │ children_count     │
│ total_size   │                 │ depth              │
│ total_files  │       self-ref  │ parent_path ───────┤ (hierarquia)
│ total_dirs   │                 └──────────────────┘
└──────┬───────┘
       │
       │  1:N         ┌──────────────────┐
       └─────────────►│    FileItem       │
                      │                    │
                      │ path (PK)          │
                      │ scan_job_id (FK)   │
                      │ name               │
                      │ size               │
                      │ extension          │
                      │ modified_at        │
                      │ is_temp            │
                      │ is_old             │
                      └──────────────────┘

┌──────────────────┐
│  SystemMetric    │  (em memória, snapshot único)
│                    │
│ timestamp        │       ┌──────────────────┐
│ cpu_percent      │  1:N  │    DiskInfo       │
│ ram_used         │──────►│                    │
│ ram_total        │       │ name               │
│ disks[]          │       │ mount_point        │
│                    │       │ total_space        │
└──────────────────┘       │ used_space         │
                           │ available_space    │
                           │ fs_type            │
                           └──────────────────┘

┌──────────────────┐
│ ResourceHistory  │  (persistido em SQLite)
│                    │
│ id (PK)          │
│ timestamp        │
│ cpu              │
│ ram              │
│ disk_io_read     │
│ disk_io_write    │
└──────────────────┘

┌──────────────────┐
│  CleanupAction   │
│                    │
│ id (PK)          │
│ action_type      │
│ target_path      │
│ size_freed       │
│ timestamp        │
│ status           │
│ reverted         │
└──────────────────┘

┌──────────────────┐       ┌──────────────────┐
│  UserSettings    │       │     AppLog       │
│                    │       │                    │
│ (arquivo JSON)   │       │ id (PK)          │
│ update_interval  │       │ timestamp        │
│ ignored_paths[]  │       │ level            │
│ safe_mode        │       │ message          │
│ theme            │       │ context          │
│ size_unit        │       └──────────────────┘
│ auto_cleanup {}  │
└──────────────────┘
```

---

## 8. Estratégia de Scan de Disco

### 8.1 Visão Geral do Processo

O scan de disco é a operação central do TracOS. Ele precisa ser rápido, cancelável, e comunicar progresso em tempo real para o frontend.

```
┌─────────┐    invoke()     ┌─────────────┐    spawn()    ┌──────────────┐
│ Frontend │───────────────►│ ScanCommand  │─────────────►│  ScanService  │
│          │                │              │              │              │
│          │  ScanJob       │ Valida path  │  Tokio task  │ walkdir +    │
│          │◄───────────────│ Cria ScanJob │              │ rayon        │
│          │                └──────────────┘              │              │
│          │                                              │ Percorre     │
│          │◄ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│ diretórios   │
│          │  Event: scan_progress (a cada 500 items)     │              │
│          │                                              │ Calcula      │
│          │◄ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│ tamanhos     │
│          │  Event: scan_progress                        │              │
│          │                                              │ Armazena     │
│          │◄ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│ em SQLite    │
│          │  Event: scan_complete                        │              │
└─────────┘                                              └──────────────┘
```

### 8.2 Algoritmo de Varredura

```
ALGORITMO: ScanDirectory(root_path)

ENTRADA: root_path (String) - caminho raiz para escanear
SAÍDA: DirectoryTree com tamanhos calculados

1.  CRIAR ScanJob com status = Running
2.  EMITIR evento "scan_started" com job_id
3.  INICIALIZAR:
    - AtomicU64 para contador de arquivos processados
    - AtomicBool para flag de cancelamento
    - ConcurrentHashMap para acumular tamanhos de diretórios
    - Channel (mpsc) para envio de progresso

4.  FASE 1 - COLETA (paralela via rayon):
    ┌─────────────────────────────────────────────────┐
    │ walkdir::WalkDir::new(root_path)                │
    │   .follow_links(false)          // Evitar loops │
    │   .same_file_system(true)       // Não cruzar   │
    │   .max_depth(u32::MAX)          // partições     │
    │                                                  │
    │ PARA CADA entry em parallel_iterator:            │
    │   SE cancellation_flag == true:                  │
    │     BREAK                                        │
    │                                                  │
    │   SE entry é ARQUIVO:                            │
    │     metadata = entry.metadata()                  │
    │     CRIAR FileItem {                             │
    │       path, name, size, extension,               │
    │       modified_at, is_temp, is_old               │
    │     }                                            │
    │     ACUMULAR size no diretório pai               │
    │     INCREMENTAR contador                         │
    │                                                  │
    │   SE entry é DIRETÓRIO:                          │
    │     CRIAR DirectoryNode {                        │
    │       path, name, depth, parent_path             │
    │     }                                            │
    │                                                  │
    │   A CADA 500 itens processados:                  │
    │     EMITIR evento "scan_progress" {              │
    │       scanned, current_path                      │
    │     }                                            │
    └─────────────────────────────────────────────────┘

5.  FASE 2 - CÁLCULO DE TAMANHOS (bottom-up):
    ┌─────────────────────────────────────────────────┐
    │ ORDENAR diretórios por profundidade DESC         │
    │                                                  │
    │ PARA CADA diretório (do mais profundo ao raiz):  │
    │   dir.size = soma dos tamanhos dos filhos        │
    │   dir.children_count = count de filhos diretos   │
    │                                                  │
    │   SE dir.parent_path existe:                     │
    │     parent.size += dir.size                      │
    └─────────────────────────────────────────────────┘

6.  FASE 3 - PERSISTÊNCIA:
    ┌─────────────────────────────────────────────────┐
    │ TRANSACTION BEGIN                                │
    │   INSERT BATCH directory_nodes                   │
    │   INSERT BATCH file_items                        │
    │   UPDATE scan_job SET status = Completed,        │
    │     total_size, total_files, total_dirs,          │
    │     finished_at = NOW()                          │
    │ TRANSACTION COMMIT                               │
    └─────────────────────────────────────────────────┘

7.  EMITIR evento "scan_complete" com resultado final
```

### 8.3 Multithreading e Paralelismo

| Componente        | Estratégia                                                                         |
|-------------------|-------------------------------------------------------------------------------------|
| **Travessia**     | `walkdir` single-threaded para enumerar entradas (I/O bound)                        |
| **Processamento** | `rayon` parallel iterator para processar metadados de arquivos                      |
| **I/O de Disco**  | Batch inserts no SQLite com write-ahead log (WAL) habilitado                        |
| **Progresso**     | `tokio::sync::mpsc` channel para enviar updates do thread de scan para o event loop |
| **Cancelamento**  | `AtomicBool` compartilhado, verificado a cada iteração                              |

### 8.4 Tratamento de Erros durante Scan

| Cenário                          | Comportamento                                              |
|----------------------------------|------------------------------------------------------------|
| Arquivo sem permissão de leitura | Log warn, pular arquivo, continuar scan                    |
| Diretório inacessível            | Log warn, pular diretório inteiro, continuar scan          |
| Nome de arquivo inválido (UTF-8) | Usar lossy conversion, marcar no log                       |
| Link simbólico circular          | `follow_links(false)` previne loops                        |
| Disco removido durante scan      | Detectar erro I/O, emitir `scan_error`, status = Error     |
| Falta de memória                 | Batch processing com limite de 10.000 itens em memória     |
| Cancelamento pelo usuário        | Flag atômica, finaliza gracefully, status = Cancelled      |

### 8.5 Otimizações de Performance

1. **Batch Insert**: Acumular 1.000-5.000 registros antes de fazer INSERT no SQLite.
2. **WAL Mode**: SQLite em modo Write-Ahead Log para não bloquear leituras durante escrita.
3. **Memory-Mapped I/O**: Usar `mmap` para leitura de metadados em discos SSD.
4. **Caching de Resultados**: Manter último scan em memória para navegação instantânea.
5. **Lazy Loading**: Carregar árvore de diretórios sob demanda (por nível de profundidade).
6. **Debounce de Progresso**: Emitir eventos de progresso no máximo a cada 100ms.
7. **Índices SQLite**: Índices estratégicos em `size`, `extension`, `parent_path` para queries rápidas.

### 8.6 Cache e Invalidação

```
┌──────────────────────────────────────────────────────────────────┐
│                        CACHE STRATEGY                            │
│                                                                  │
│  Nível 1: In-Memory (HashMap<JobId, ScanResult>)                │
│  ├── Mantém último scan completo                                 │
│  ├── Evicção: LRU com máximo de 3 scans                        │
│  └── Invalidação: Novo scan do mesmo path                        │
│                                                                  │
│  Nível 2: SQLite (Persistente)                                   │
│  ├── Todos os scans com resultados                               │
│  ├── Retenção: Últimos 10 scans ou 30 dias                      │
│  └── Limpeza automática ao iniciar app                           │
│                                                                  │
│  Invalidação:                                                    │
│  ├── Manual: Usuário clica "Re-scan"                            │
│  ├── Temporal: Scan com mais de 24h mostra badge "desatualizado" │
│  └── Por evento: Deleção de arquivo invalida scan afetado        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 9. Estratégia de Gráficos e Visualização

### 9.1 Biblioteca e Tecnologias

| Tipo de Gráfico    | Biblioteca         | Justificativa                                                    |
|--------------------|--------------------|------------------------------------------------------------------|
| Line Chart (CPU)   | Recharts           | Performance com dados em tempo real, animações suaves            |
| Line Chart (RAM)   | Recharts           | Consistência com CPU chart, mesmo componente base                |
| Area Chart (I/O)   | Recharts           | Visualização de throughput com preenchimento                     |
| Bar Chart (Disco)  | Recharts           | Barras horizontais para comparação de partições                  |
| Gauge (Dashboard)  | Custom SVG/Canvas  | Controle total sobre visual, sem overhead de lib                 |
| Treemap (Disco)    | Custom Canvas/D3   | Performance com milhares de nós, interatividade customizada      |
| Pie Chart (Tipos)  | Recharts           | Distribuição por tipo de arquivo                                 |

### 9.2 Configuração de Gráficos por Tela

#### Dashboard - Gauges de CPU e RAM

```
Componente: GaugeCircle
Dados: SystemMetric.cpu_percent, SystemMetric.ram_used/ram_total
Atualização: A cada {update_interval} segundos (padrão: 2s)
Cores:
  0-50%:   #2E7D32 (verde)
  50-80%:  #F9A825 (amarelo)
  80-100%: #C62828 (vermelho)
Animação: Transição suave de 300ms entre valores
Tamanho: 120x120px por gauge
```

#### Dashboard - Barras de Disco

```
Componente: DiskUsageBar
Dados: DiskInfo[] (total_space, used_space)
Atualização: A cada 30 segundos (discos mudam lentamente)
Layout: Barra horizontal com gradiente
Cores:
  Usado:     Gradiente #1B5E20 → #4CAF50
  Disponível: #333333 (dark) / #E0E0E0 (light)
  Crítico:    Gradiente #C62828 → #EF5350 (quando >90%)
Label: "C: 234.5 GB / 476.9 GB (49.2%)"
```

#### Monitor de Recursos - Line Charts

```
Componente: CpuChart / RamChart
Dados: ResourceHistory[] (últimos 60 pontos)
Atualização: A cada {update_interval} segundos
Configuração Recharts:
  type: "monotone"
  strokeWidth: 2
  dot: false (performance)
  animationDuration: 200
  isAnimationActive: true
Eixo X: Tempo (HH:MM:SS), últimos 60 segundos
Eixo Y: 0-100% (CPU) / 0-{ram_total} GB (RAM)
Grid: Horizontal lines only, opacity 0.1
Tooltip: Valor exato no hover
Cores:
  CPU Line: #42A5F5 (azul)
  RAM Line: #AB47BC (roxo)
  Fill (area): Cor da line com opacity 0.1
Responsividade: ResponsiveContainer width="100%" height={200}
```

#### Treemap de Disco

```
Componente: DiskTreemap (Custom Canvas)
Dados: DirectoryNode[] do scan
Renderização: HTML5 Canvas para performance com >10.000 nós
Algoritmo: Squarified Treemap (melhor aspect ratio)
Cores por tipo de conteúdo:
  Documentos:  #42A5F5 (azul)
  Imagens:     #66BB6A (verde)
  Vídeos:      #EF5350 (vermelho)
  Áudio:       #AB47BC (roxo)
  Código:      #FFA726 (laranja)
  Compactados: #26C6DA (ciano)
  Temporários: #78909C (cinza)
  Outros:      #8D6E63 (marrom)
Interação:
  Hover:       Highlight com borda branca + tooltip
  Click:       Zoom in no diretório (navegar um nível)
  Right-click: Menu contextual (deletar, abrir, copiar)
  Breadcrumb:  Voltar para nível anterior
Limites:
  max_visible_nodes: 500 (agrupar menores em "Outros")
  min_block_size: 4x4 pixels
  label_min_size: 40x20 pixels (só mostrar texto se couber)
```

### 9.3 Intervalos de Atualização

| Métrica              | Intervalo Padrão | Intervalo Mínimo | Intervalo Máximo | Nota                          |
|----------------------|------------------|-------------------|-------------------|-------------------------------|
| CPU %                | 2s               | 1s                | 30s               | Configurável pelo usuário     |
| RAM %                | 2s               | 1s                | 30s               | Mesmo intervalo do CPU        |
| Disk I/O             | 2s               | 1s                | 30s               | Calculado como delta/intervalo|
| Disk Space           | 30s              | 10s               | 300s              | Muda lentamente               |
| Dashboard Gauges     | 2s               | 1s                | 30s               | Segue intervalo global        |
| History Persistence  | 5s               | 2s                | 60s               | Escrita no SQLite             |

### 9.4 Gerenciamento de Dados em Gráficos

```
┌─────────────────────────────────────────────────────┐
│              DATA FLOW PARA GRÁFICOS                │
│                                                      │
│  Backend (Rust)                                      │
│  ├── MetricsService.collect() [a cada N segundos]    │
│  ├── Armazena em ring buffer (últimos 300 pontos)    │
│  ├── Persiste no SQLite (a cada 5s)                  │
│  └── Emite evento "metrics_update"                   │
│                                                      │
│  Frontend (React)                                    │
│  ├── useMetrics() hook escuta "metrics_update"       │
│  ├── metricsStore mantém array circular de 60 pontos │
│  ├── Novos dados: push + shift (FIFO)                │
│  ├── Recharts re-renderiza com dados atualizados     │
│  └── requestAnimationFrame para sincronizar frames   │
│                                                      │
│  Otimizações:                                        │
│  ├── React.memo nos componentes de chart             │
│  ├── useMemo para formatação de dados                │
│  ├── Evitar re-render de componentes não afetados     │
│  └── Throttle de updates se tab não está visível      │
└─────────────────────────────────────────────────────┘
```

---

## 10. Estratégia de Limpeza

### 10.1 Princípios de Segurança

1. **Nunca deletar sem confirmação explícita do usuário** (em modo seguro)
2. **Preferir lixeira sobre deleção permanente** (padrão)
3. **Manter registro de toda operação** para auditoria e rollback
4. **Categorizar risco**: Temporários (baixo), Downloads antigos (médio), Arquivos de sistema (proibido)
5. **Limitar escopo**: Nunca operar em diretórios protegidos do sistema

### 10.2 Diretórios Protegidos (Blocklist)

```rust
const PROTECTED_PATHS: &[&str] = &[
    "C:\\Windows",
    "C:\\Program Files",
    "C:\\Program Files (x86)",
    "C:\\ProgramData",
    "C:\\$Recycle.Bin",
    "C:\\System Volume Information",
    "C:\\Recovery",
    "C:\\Boot",
    "C:\\EFI",
];

const PROTECTED_EXTENSIONS: &[&str] = &[
    "sys", "dll", "exe", "drv", "msi",
];
```

### 10.3 Categorias de Limpeza Inteligente

| Categoria         | Locais Escaneados                                        | Extensões           | Risco   |
|-------------------|----------------------------------------------------------|---------------------|---------|
| Temporários       | `%TEMP%`, `%LOCALAPPDATA%\Temp`, `C:\Windows\Temp`      | `.tmp`, `.temp`     | Baixo   |
| Cache de Browser  | Chrome/Edge/Firefox cache dirs                           | `*`                 | Baixo   |
| Logs Antigos      | Qualquer diretório                                       | `.log` (>30 dias)   | Baixo   |
| Downloads Antigos | `%USERPROFILE%\Downloads`                                | `*` (>90 dias)      | Médio   |
| Thumbnails        | `%LOCALAPPDATA%\Microsoft\Windows\Explorer`              | `.db`               | Baixo   |
| Crash Dumps       | `%LOCALAPPDATA%\CrashDumps`                              | `.dmp`, `.mdmp`     | Baixo   |
| Update Cache      | `C:\Windows\SoftwareDistribution\Download`               | `*`                 | Médio   |
| Arquivos Antigos  | Configurável pelo usuário                                | `*` (>N dias)       | Médio   |
| Duplicatas        | Escopo do scan                                           | `*` (mesmo hash)    | Alto    |

### 10.4 Fluxo de Limpeza Segura

```
┌─────────┐                                              ┌──────────┐
│ Usuário  │                                              │ Backend  │
└────┬─────┘                                              └────┬─────┘
     │                                                         │
     │  1. Seleciona categorias de limpeza                     │
     │  2. Clica "Analisar"                                    │
     ├────────────────────────────────────────────────────────►│
     │                                                         │
     │         invoke("smart_cleanup_scan", {categories})      │
     │                                                         │
     │                                                         │  3. Scan das categorias
     │                                                         │     selecionadas
     │                                                         │
     │  4. Recebe lista de candidatos                          │
     │     com tamanho, data, risco                            │
     │◄────────────────────────────────────────────────────────┤
     │                                                         │
     │  5. Revisa lista, seleciona itens                       │
     │     (checkbox por item ou categoria)                    │
     │                                                         │
     │  6. Vê resumo: "X arquivos, Y GB serão liberados"       │
     │                                                         │
     │  7. Clica "Limpar Selecionados"                         │
     │                                                         │
     │  ┌─────────────────────────────────────┐                │
     │  │  MODAL DE CONFIRMAÇÃO               │                │
     │  │                                      │                │
     │  │  "Tem certeza que deseja remover     │                │
     │  │   47 arquivos (2.3 GB)?"             │                │
     │  │                                      │                │
     │  │  [x] Enviar para Lixeira (recomendado)│               │
     │  │  [ ] Deletar permanentemente         │                │
     │  │                                      │                │
     │  │  [Cancelar]  [Confirmar Limpeza]     │                │
     │  └─────────────────────────────────────┘                │
     │                                                         │
     │  8. Confirma                                            │
     ├────────────────────────────────────────────────────────►│
     │                                                         │
     │     invoke("execute_cleanup",                           │
     │            {items, to_trash: true})                      │
     │                                                         │
     │                                                         │  9. PARA CADA item:
     │◄ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│     a. Verificar se existe
     │  Event: cleanup_progress (processed: 15/47)             │     b. Mover para lixeira
     │                                                         │     c. Registrar CleanupAction
     │◄ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│     d. Atualizar progresso
     │  Event: cleanup_progress (processed: 47/47)             │
     │                                                         │
     │  10. Resultado final                                    │
     │◄────────────────────────────────────────────────────────┤
     │                                                         │
     │  ┌─────────────────────────────────────┐                │
     │  │  RESULTADO                          │                │
     │  │                                      │                │
     │  │  ✓ 45 arquivos removidos             │                │
     │  │  ✗ 2 arquivos falharam (em uso)      │                │
     │  │  Total liberado: 2.1 GB              │                │
     │  │                                      │                │
     │  │  [Ver Detalhes]  [Desfazer]  [OK]    │                │
     │  └─────────────────────────────────────┘                │
     │                                                         │
```

### 10.5 Rollback (Desfazer)

```
ALGORITMO: Rollback(action_id)

1.  BUSCAR CleanupAction pelo ID
2.  VERIFICAR:
    - action.status == Success
    - action.reverted == false
    - action.action_type == DeleteToTrash (permanente não é reversível)
3.  SE verificações OK:
    a. Chamar trash::os_limited::list() para encontrar item na lixeira
    b. Restaurar arquivo para target_path original
    c. ATUALIZAR CleanupAction:
       - reverted = true
       - status = Reverted
    d. REGISTRAR AppLog com detalhes do rollback
    e. RETORNAR sucesso
4.  SE action_type == DeletePermanent:
    RETORNAR erro "Não é possível reverter deleção permanente"
5.  SE arquivo não encontrado na lixeira:
    RETORNAR erro "Arquivo não encontrado na lixeira (pode ter sido esvaziada)"
```

### 10.6 Matriz de Decisão de Limpeza

```
┌────────────────────┬──────────┬────────────┬─────────────┬──────────────┐
│ Tipo de Arquivo    │ Modo     │ Confirmação│ Lixeira     │ Rollback     │
│                    │ Seguro   │ Necessária │ Obrigatória │ Disponível   │
├────────────────────┼──────────┼────────────┼─────────────┼──────────────┤
│ Temporário (.tmp)  │ ON/OFF   │ Sim        │ Sim (ON)    │ Sim (trash)  │
│ Log antigo (.log)  │ ON/OFF   │ Sim        │ Sim (ON)    │ Sim (trash)  │
│ Cache de browser   │ ON/OFF   │ Sim        │ Não*        │ Não          │
│ Download antigo    │ ON       │ Sim (2x)   │ Sim         │ Sim (trash)  │
│ Duplicata          │ ON       │ Sim (2x)   │ Sim         │ Sim (trash)  │
│ Arquivo de sistema │ ---      │ BLOQUEADO  │ ---         │ ---          │
│ Arquivo em uso     │ ---      │ SKIP       │ ---         │ ---          │
├────────────────────┼──────────┼────────────┼─────────────┼──────────────┤
│ * Cache de browser é recriado automaticamente                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Wireframes Textuais

### 11.1 Dashboard Principal

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TracOS - Central de Controle                                          [─][□][✕] │
├────────┬─────────────────────────────────────────────────────────────────────────┤
│        │                                                                         │
│  ☰     │  DASHBOARD                                                    ⚙  🔔    │
│        │                                                                         │
│ ┌────┐ │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐  │
│ │ 📊 │ │  │   CPU            │ │   Memória RAM    │ │   Status do Sistema     │  │
│ │Dash│ │  │                  │ │                  │ │                         │  │
│ │    │ │  │    ╭────╮        │ │    ╭────╮        │ │  Hostname: DESKTOP-TB01 │  │
│ ├────┤ │  │   ╱  23 ╲       │ │   ╱  67 ╲       │ │  OS: Windows 11 Pro     │  │
│ │ 💾 │ │  │  │  %    │      │ │  │  %    │      │ │  Uptime: 3d 14h 22m     │  │
│ │Disc│ │  │   ╲     ╱       │ │   ╲     ╱       │ │  Último Scan: há 2h     │  │
│ │    │ │  │    ╰────╯        │ │    ╰────╯        │ │                         │  │
│ ├────┤ │  │  4 cores, 3.4GHz │ │  10.8/16.0 GB   │ │  [Iniciar Scan Rápido]  │  │
│ │ 📈 │ │  └─────────────────┘ └─────────────────┘ └─────────────────────────┘  │
│ │Rec │ │                                                                         │
│ │    │ │  ┌─────────────────────────────────────────────────────────────────────┐│
│ ├────┤ │  │   Discos                                                            ││
│ │ 🧹 │ │  │                                                                     ││
│ │Limp│ │  │   C: (Windows)     ████████████████████░░░░░░░░  234.5/476.9 GB 49% ││
│ │    │ │  │   D: (Dados)       ████████████████████████████░  891.2/931.5 GB 96% ││
│ ├────┤ │  │   E: (Backup)      ████░░░░░░░░░░░░░░░░░░░░░░░░  120.0/931.5 GB 13% ││
│ │ 📋 │ │  │                                                                     ││
│ │Hist│ │  └─────────────────────────────────────────────────────────────────────┘│
│ │    │ │                                                                         │
│ ├────┤ │  ┌─────────────────────────────┐ ┌─────────────────────────────────────┐│
│ │ ⚙  │ │  │   Alertas Ativos       (3)   │ │   Atividade Recente                ││
│ │Conf│ │  │                              │ │                                     ││
│ │    │ │  │ 🔴 Disco D: acima de 95%     │ │ 14:32 - Scan concluído (C:\Users)   ││
│ ├────┤ │  │ 🟡 RAM acima de 80%          │ │ 14:30 - Scan iniciado               ││
│ │ ❓ │ │  │ 🟡 45 GB em temporários      │ │ 13:15 - Limpeza: 2.3 GB liberados   ││
│ │Help│ │  │                              │ │ 11:00 - Configurações atualizadas   ││
│ │    │ │  │                              │ │ 09:45 - Aplicação iniciada           ││
│ └────┘ │  └─────────────────────────────┘ └─────────────────────────────────────┘│
│        │                                                                         │
├────────┴─────────────────────────────────────────────────────────────────────────┤
│  TracOS v1.0.0  │  CPU: 23%  │  RAM: 67%  │  Disco C: 49%  │  Atualizado: 14:35 │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Análise de Disco

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TracOS - Central de Controle                                          [─][□][✕] │
├────────┬─────────────────────────────────────────────────────────────────────────┤
│        │                                                                         │
│  MENU  │  ANÁLISE DE DISCO                                                       │
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Caminho: [ C:\Users\ricardo              ] [📁 Selecionar] [▶ Scan]││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  ████████████████████████████████████░░░░░░  78% concluído          ││
│        │  │  Escaneando: C:\Users\ricardo\Documents\Projetos\...                ││
│        │  │  45.234 arquivos | 3.892 pastas | 156.7 GB | 00:01:34              ││
│        │  │                                                      [■ Cancelar]   ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  📂 C: > Users > ricardo > Documents                                    │
│        │                                                                         │
│        │  ┌──────────────────────────────────────────────────────────────────┐   │
│        │  │ Nome              │ Tamanho  │ Tipo   │ Itens  │ Modificado     │   │
│        │  ├───────────────────┼──────────┼────────┼────────┼────────────────┤   │
│        │  │ 📁 Projetos       │ 45.2 GB  │ Pasta  │ 1.234  │ 19/03/2026     │   │
│        │  │ 📁 Downloads      │ 23.1 GB  │ Pasta  │   892  │ 18/03/2026     │   │
│        │  │ 📁 Imagens        │ 12.8 GB  │ Pasta  │ 4.521  │ 15/03/2026     │   │
│        │  │ 📁 Vídeos         │  8.4 GB  │ Pasta  │    67  │ 10/03/2026     │   │
│        │  │ 📁 Desktop        │  5.1 GB  │ Pasta  │   234  │ 19/03/2026     │   │
│        │  │ 📄 backup.zip     │  2.3 GB  │ .zip   │    —   │ 01/03/2026     │   │
│        │  │ 📁 .config        │  1.2 GB  │ Pasta  │   156  │ 14/03/2026     │   │
│        │  │ 📄 relatorio.pdf  │ 45.6 MB  │ .pdf   │    —   │ 12/03/2026     │   │
│        │  │ 📄 notas.txt      │  2.1 KB  │ .txt   │    —   │ 19/03/2026     │   │
│        │  └──────────────────────────────────────────────────────────────────┘   │
│        │                                                                         │
│        │  Filtro: [Todos ▾]  Ordenar: [Tamanho ▾]  Total: 98.2 GB em 7.104 itens│
│        │                                                                         │
├────────┴─────────────────────────────────────────────────────────────────────────┤
│  TracOS v1.0.0  │  CPU: 45%  │  RAM: 72%  │  Scan ativo...                      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 11.3 Treemap de Disco

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TracOS - Central de Controle                                          [─][□][✕] │
├────────┬─────────────────────────────────────────────────────────────────────────┤
│        │                                                                         │
│  MENU  │  TREEMAP DE DISCO          📂 C: > Users > ricardo                      │
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │                                                                     ││
│        │  │  ┌──────────────────────────┐┌────────────────┐┌──────────────────┐ ││
│        │  │  │                          ││                ││                  │ ││
│        │  │  │        Projetos          ││   Downloads    ││    Imagens       │ ││
│        │  │  │        45.2 GB           ││   23.1 GB      ││    12.8 GB       │ ││
│        │  │  │                          ││                ││                  │ ││
│        │  │  │   ┌──────┐┌───────────┐  ││  ┌──────────┐ ││  ┌────┐┌──────┐ │ ││
│        │  │  │   │Code  ││  Assets   │  ││  │ ISOs     │ ││  │Fotos││Scans │ │ ││
│        │  │  │   │Craft ││  12.1 GB  │  ││  │ 15.0 GB  │ ││  │8.2G││ 3.1G │ │ ││
│        │  │  │   │18.5GB││           │  ││  │          │ ││  │    ││      │ │ ││
│        │  │  │   │      ││           │  ││  └──────────┘ ││  └────┘└──────┘ │ ││
│        │  │  │   └──────┘└───────────┘  ││  ┌────┐┌────┐ ││  ┌─────────────┐│ ││
│        │  │  │   ┌──────────────────┐   ││  │.exe││.zip│ ││  │  Wallpapers ││ ││
│        │  │  │   │   TracOS 8.3 GB  │   ││  │4.1G││2.5G│ ││  │  1.5 GB     ││ ││
│        │  │  │   └──────────────────┘   ││  └────┘└────┘ ││  └─────────────┘│ ││
│        │  │  └──────────────────────────┘└────────────────┘└──────────────────┘ ││
│        │  │  ┌──────────┐┌───────┐┌──────────────────┐┌───────┐┌─────────────┐ ││
│        │  │  │  Vídeos  ││Desktop││    .config        ││backup ││   Outros    │ ││
│        │  │  │  8.4 GB  ││5.1 GB ││    1.2 GB         ││2.3 GB ││   0.1 GB    │ ││
│        │  │  └──────────┘└───────┘└──────────────────┘└───────┘└─────────────┘ ││
│        │  │                                                                     ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  Hover: Projetos/CodeCraftHub (18.5 GB - 234 arquivos)    [Voltar Nível]│
│        │                                                                         │
├────────┴─────────────────────────────────────────────────────────────────────────┤
│  TracOS v1.0.0  │  Último scan: 19/03/2026 14:32  │  Total: 98.2 GB              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 11.4 Maiores Arquivos

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TracOS - Central de Controle                                          [─][□][✕] │
├────────┬─────────────────────────────────────────────────────────────────────────┤
│        │                                                                         │
│  MENU  │  MAIORES ARQUIVOS                                                       │
│        │                                                                         │
│        │  Escopo: [Último scan: C:\Users\ricardo ▾]     Mostrar: [Top 100 ▾]     │
│        │                                                                         │
│        │  ┌──────────────────────────────────────────────────────────────────┐   │
│        │  │  #  │ Nome                │ Caminho              │ Tamanho │ Ações│  │
│        │  ├─────┼─────────────────────┼──────────────────────┼─────────┼──────┤  │
│        │  │  1  │ ubuntu-22.04.iso    │ ...\Downloads\       │ 4.7 GB  │ ⋮    │  │
│        │  │  2  │ win11-setup.iso     │ ...\Downloads\       │ 4.2 GB  │ ⋮    │  │
│        │  │  3  │ project-backup.tar  │ ...\Projetos\        │ 3.8 GB  │ ⋮    │  │
│        │  │  4  │ training-video.mp4  │ ...\Vídeos\          │ 2.9 GB  │ ⋮    │  │
│        │  │  5  │ database-dump.sql   │ ...\Projetos\db\     │ 2.3 GB  │ ⋮    │  │
│        │  │  6  │ backup-mar.zip      │ ...\Desktop\         │ 2.1 GB  │ ⋮    │  │
│        │  │  7  │ node_modules.zip    │ ...\Downloads\       │ 1.8 GB  │ ⋮    │  │
│        │  │  8  │ presentation.pptx   │ ...\Documents\       │ 1.2 GB  │ ⋮    │  │
│        │  │  9  │ design-assets.psd   │ ...\Projetos\ui\     │ 890 MB  │ ⋮    │  │
│        │  │ 10  │ debug.log           │ ...\AppData\Local\   │ 756 MB  │ ⋮    │  │
│        │  │     │                     │                      │         │      │  │
│        │  │     │       ... mais 90 arquivos ...             │         │      │  │
│        │  └──────────────────────────────────────────────────────────────────┘   │
│        │                                                                         │
│        │  Menu Ações (⋮):                                                        │
│        │  ┌─────────────────────┐                                                │
│        │  │ 📂 Abrir no Explorer │                                                │
│        │  │ 📋 Copiar Caminho    │                                                │
│        │  │ 🗑  Deletar          │                                                │
│        │  └─────────────────────┘                                                │
│        │                                                                         │
│        │  Total dos Top 100: 34.7 GB (35.3% do scan)                             │
│        │                                                                         │
├────────┴─────────────────────────────────────────────────────────────────────────┤
│  TracOS v1.0.0  │  CPU: 12%  │  RAM: 58%  │  100 arquivos listados              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 11.5 Monitor de Recursos

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TracOS - Central de Controle                                          [─][□][✕] │
├────────┬─────────────────────────────────────────────────────────────────────────┤
│        │                                                                         │
│  MENU  │  MONITOR DE RECURSOS                     Intervalo: [2 segundos ▾]      │
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  CPU - Intel Core i7-12700H                            Atual: 34%   ││
│        │  │                                                                     ││
│        │  │  100%│                                                              ││
│        │  │   80%│                                                              ││
│        │  │   60%│          ╭─╮                                                 ││
│        │  │   40%│     ╭──╯   ╰─╮  ╭╮        ╭─╮                  ╭─╮         ││
│        │  │   20%│╭──╯          ╰╮╭╯╰─╮╭───╮╭╯  ╰──╮   ╭───╮╭──╯   ╰╮╭──    ││
│        │  │    0%│╰               ╰╯    ╰╯   ╰╯      ╰──╯    ╰╯       ╰╯      ││
│        │  │      └──────────────────────────────────────────────────────────     ││
│        │  │       -60s            -40s            -20s              agora        ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Memória RAM                                   Atual: 10.8/16.0 GB  ││
│        │  │                                                                     ││
│        │  │  16GB│                                                              ││
│        │  │  12GB│████████████████████████████████████████████████████████████   ││
│        │  │   8GB│████████████████████████████████████████████████████████████   ││
│        │  │   4GB│████████████████████████████████████████████████████████████   ││
│        │  │   0GB│                                                              ││
│        │  │      └──────────────────────────────────────────────────────────     ││
│        │  │       -60s            -40s            -20s              agora        ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Discos                                                             ││
│        │  │                                                                     ││
│        │  │  C: (NTFS)   ████████████████████░░░░░░░░░░  234.5/476.9 GB   49%  ││
│        │  │  D: (NTFS)   ████████████████████████████░░░  891.2/931.5 GB   96%  ││
│        │  │  E: (NTFS)   ████░░░░░░░░░░░░░░░░░░░░░░░░░░  120.0/931.5 GB   13%  ││
│        │  │                                                                     ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
├────────┴─────────────────────────────────────────────────────────────────────────┤
│  TracOS v1.0.0  │  CPU: 34%  │  RAM: 67%  │  Atualização: em tempo real         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 11.6 Limpeza Inteligente

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TracOS - Central de Controle                                          [─][□][✕] │
├────────┬─────────────────────────────────────────────────────────────────────────┤
│        │                                                                         │
│  MENU  │  LIMPEZA INTELIGENTE                                                    │
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Selecione as categorias para análise:                              ││
│        │  │                                                                     ││
│        │  │  [x] 🗑  Arquivos Temporários        ~12.3 GB estimado              ││
│        │  │  [x] 📋 Logs Antigos (>30 dias)      ~8.7 GB estimado              ││
│        │  │  [x] 🌐 Cache de Navegadores         ~3.4 GB estimado              ││
│        │  │  [ ] 📥 Downloads Antigos (>90 dias)  ~15.2 GB estimado              ││
│        │  │  [ ] 💥 Crash Dumps                   ~1.1 GB estimado              ││
│        │  │  [ ] 🖼  Thumbnails                   ~0.5 GB estimado              ││
│        │  │                                                                     ││
│        │  │  Estimativa total: 24.4 GB              [🔍 Analisar Selecionados]  ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Resultados da Análise                           Total: 23.8 GB     ││
│        │  │                                                                     ││
│        │  │  ▼ Arquivos Temporários (1.247 itens)                   12.1 GB     ││
│        │  │    [x] C:\Users\...\AppData\Local\Temp\~DF3A2B.tmp      234 MB     ││
│        │  │    [x] C:\Users\...\AppData\Local\Temp\setup_log.tmp    189 MB     ││
│        │  │    [x] C:\Windows\Temp\cab_4521_2.tmp                   156 MB     ││
│        │  │    ... [Selecionar Todos] [Desmarcar Todos]                         ││
│        │  │                                                                     ││
│        │  │  ▶ Logs Antigos (892 itens)                              8.5 GB     ││
│        │  │  ▶ Cache de Navegadores (3.421 itens)                    3.2 GB     ││
│        │  │                                                                     ││
│        │  ├─────────────────────────────────────────────────────────────────────┤│
│        │  │                                                                     ││
│        │  │  Selecionados: 2.139 itens | 23.8 GB                               ││
│        │  │                                                                     ││
│        │  │  [x] Enviar para Lixeira            [🧹 Limpar Selecionados]        ││
│        │  │                                                                     ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
├────────┴─────────────────────────────────────────────────────────────────────────┤
│  TracOS v1.0.0  │  Modo Seguro: ATIVO  │  Último cleanup: há 3 dias             │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 11.7 Histórico de Ações

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TracOS - Central de Controle                                          [─][□][✕] │
├────────┬─────────────────────────────────────────────────────────────────────────┤
│        │                                                                         │
│  MENU  │  HISTÓRICO DE AÇÕES                                                     │
│        │                                                                         │
│        │  Filtros:                                                                │
│        │  Tipo: [Todos ▾]   Período: [19/02/2026] até [19/03/2026]  [Exportar 📥]│
│        │                                                                         │
│        │  ┌──────────────────────────────────────────────────────────────────┐   │
│        │  │ Data/Hora        │ Tipo      │ Alvo                │ Tamanho│ Ação│  │
│        │  ├──────────────────┼───────────┼─────────────────────┼────────┼─────┤  │
│        │  │ 19/03 14:32      │ ✅ Scan    │ C:\Users\ricardo    │   —    │  ℹ  │  │
│        │  │ 19/03 14:15      │ 🧹 Limpeza │ Temporários (1.247) │ 12.1GB│ ↩ ℹ │  │
│        │  │ 19/03 11:00      │ ⚙ Config   │ Intervalo: 2s→5s    │   —    │  ℹ  │  │
│        │  │ 18/03 16:45      │ 🗑 Deleção │ backup-old.zip      │ 2.3GB │ ↩ ℹ │  │
│        │  │ 18/03 16:30      │ ✅ Scan    │ C:\Users\ricardo    │   —    │  ℹ  │  │
│        │  │ 17/03 09:00      │ 🧹 Limpeza │ Logs antigos (342)  │ 4.2GB │ ↩ ℹ │  │
│        │  │ 15/03 14:00      │ 🗑 Deleção │ ubuntu-22.04.iso    │ 4.7GB │  ℹ  │  │
│        │  │ 15/03 13:55      │ ✅ Scan    │ D:\                 │   —    │  ℹ  │  │
│        │  └──────────────────────────────────────────────────────────────────┘   │
│        │                                                                         │
│        │  ▼ Detalhes: Limpeza de 19/03 14:15                                     │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Tipo: Limpeza Inteligente                                          ││
│        │  │  Categorias: Temporários                                            ││
│        │  │  Arquivos removidos: 1.247                                          ││
│        │  │  Espaço liberado: 12.1 GB                                           ││
│        │  │  Método: Lixeira                                                    ││
│        │  │  Status: Concluído com sucesso                                      ││
│        │  │  Revertido: Não                                                     ││
│        │  │                                                    [↩ Desfazer]     ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  Página 1 de 12     [◀ Anterior]  [Próxima ▶]                           │
│        │                                                                         │
├────────┴─────────────────────────────────────────────────────────────────────────┤
│  TracOS v1.0.0  │  Total de ações: 142  │  Espaço liberado total: 67.3 GB        │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 11.8 Configurações

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TracOS - Central de Controle                                          [─][□][✕] │
├────────┬─────────────────────────────────────────────────────────────────────────┤
│        │                                                                         │
│  MENU  │  CONFIGURAÇÕES                                                          │
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Geral                                                              ││
│        │  │                                                                     ││
│        │  │  Tema da Interface                                                  ││
│        │  │  ( ) Claro    (●) Escuro    ( ) Sistema                              ││
│        │  │                                                                     ││
│        │  │  Unidade de Tamanho                                                 ││
│        │  │  (●) Automático   ( ) KB   ( ) MB   ( ) GB                           ││
│        │  │                                                                     ││
│        │  │  Idioma                                                             ││
│        │  │  [Português (Brasil) ▾]                                              ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Monitoramento                                                      ││
│        │  │                                                                     ││
│        │  │  Intervalo de Atualização                                           ││
│        │  │  1s ├───────●────────────────────────────────────────┤ 30s           ││
│        │  │                   Atual: 2 segundos                                  ││
│        │  │                                                                     ││
│        │  │  Retenção de Histórico de Métricas                                  ││
│        │  │  [30 dias ▾]                                                         ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Segurança                                                          ││
│        │  │                                                                     ││
│        │  │  Modo Seguro                                        [████████ ON ]  ││
│        │  │  Ativa confirmações extras e lixeira obrigatória                    ││
│        │  │                                                                     ││
│        │  │  Caminhos Ignorados no Scan:                                        ││
│        │  │  ┌────────────────────────────────────────────────┐                  ││
│        │  │  │ C:\Windows                              [✕]   │                  ││
│        │  │  │ C:\Program Files                        [✕]   │                  ││
│        │  │  │ C:\Program Files (x86)                  [✕]   │                  ││
│        │  │  └────────────────────────────────────────────────┘                  ││
│        │  │  [+ Adicionar Caminho]                                              ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  Limpeza Automática                                 [░░░░░░░░ OFF]  ││
│        │  │                                                                     ││
│        │  │  Frequência: [Semanal ▾]  (desabilitado)                             ││
│        │  │  Categorias: Temporários, Logs                                      ││
│        │  │  Limite por execução: [1 GB ▾]                                       ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │                                    [Restaurar Padrões]  [💾 Salvar]     │
│        │                                                                         │
├────────┴─────────────────────────────────────────────────────────────────────────┤
│  TracOS v1.0.0  │  Configurações salvas em: %APPDATA%\TracOS\settings.json       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 11.9 Central de Ajuda

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TracOS - Central de Controle                                          [─][□][✕] │
├────────┬─────────────────────────────────────────────────────────────────────────┤
│        │                                                                         │
│  MENU  │  CENTRAL DE AJUDA                                                       │
│        │                                                                         │
│        │  🔍 [Buscar na documentação...                                        ] │
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │                                                                     ││
│        │  │  📖 Guia Rápido                                                      ││
│        │  │                                                                     ││
│        │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 ││
│        │  │  │ 📊 Dashboard  │ │ 💾 Análise    │ │ 📈 Monitor   │                 ││
│        │  │  │              │ │ de Disco     │ │ de Recursos  │                 ││
│        │  │  │ Visão geral  │ │ Scan e       │ │ CPU, RAM e   │                 ││
│        │  │  │ do sistema   │ │ navegação    │ │ disco em     │                 ││
│        │  │  │              │ │ de arquivos  │ │ tempo real   │                 ││
│        │  │  └──────────────┘ └──────────────┘ └──────────────┘                 ││
│        │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 ││
│        │  │  │ 🧹 Limpeza   │ │ 📋 Histórico  │ │ ⚙ Configurar │                 ││
│        │  │  │ Inteligente  │ │              │ │              │                 ││
│        │  │  │ Liberar      │ │ Registro de  │ │ Personalizar │                 ││
│        │  │  │ espaço com   │ │ todas as     │ │ comportamento│                 ││
│        │  │  │ segurança    │ │ ações        │ │ do app       │                 ││
│        │  │  └──────────────┘ └──────────────┘ └──────────────┘                 ││
│        │  │                                                                     ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  ❓ Perguntas Frequentes                                             ││
│        │  │                                                                     ││
│        │  │  ▶ O scan é seguro? Ele modifica meus arquivos?                      ││
│        │  │  ▶ Posso recuperar arquivos deletados?                               ││
│        │  │  ▶ O que é o "Modo Seguro"?                                          ││
│        │  │  ▶ Como configurar a limpeza automática?                             ││
│        │  │  ▶ Por que o disco D: aparece como crítico?                          ││
│        │  │  ▶ O TracOS consome muitos recursos?                                 ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  ┌─────────────────────────────────────────────────────────────────────┐│
│        │  │  ⌨ Atalhos de Teclado                                               ││
│        │  │                                                                     ││
│        │  │  Ctrl+1  Dashboard          Ctrl+5  Monitor de Recursos             ││
│        │  │  Ctrl+2  Análise de Disco   Ctrl+6  Limpeza Inteligente             ││
│        │  │  Ctrl+3  Treemap            Ctrl+7  Histórico                       ││
│        │  │  Ctrl+4  Maiores Arquivos   Ctrl+,  Configurações                   ││
│        │  │  F5      Atualizar          Ctrl+Q  Sair                            ││
│        │  └─────────────────────────────────────────────────────────────────────┘│
│        │                                                                         │
│        │  TracOS v1.0.0 | Build 2026.03.19 | Tracbel Agro - Tecnologia Interna   │
│        │                                                                         │
├────────┴─────────────────────────────────────────────────────────────────────────┤
│  TracOS v1.0.0  │  Documentação: versão 1.0                                      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Fluxos de Usuário

### 12.1 Fluxo: Escanear Disco

```
┌─────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  INÍCIO  │────►│ Abrir tela   │────►│ Selecionar    │────►│ Clica "Scan" │
│          │     │ Análise Disco│     │ diretório     │     │              │
└─────────┘     └──────────────┘     └───────────────┘     └──────┬───────┘
                                                                    │
                                                                    ▼
                ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
                │ Resultado    │◄────│ Scan completo │◄────│ Progress bar │
                │ em tabela    │     │ (evento BE)   │     │ atualiza     │
                └──────┬───────┘     └───────────────┘     └──────────────┘
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
     ┌────────────┐ ┌────────┐ ┌───────────┐
     │ Navegar    │ │ Filtrar │ │ Ordenar   │
     │ subpastas  │ │ por ext │ │ por campo │
     └────────────┘ └────────┘ └───────────┘

  Caminho alternativo (cancelamento):
  Progress bar → [Cancelar] → Confirmação → Scan cancelado → Resultado parcial
```

### 12.2 Fluxo: Limpeza Inteligente

```
┌─────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  INÍCIO  │────►│ Abrir tela   │────►│ Selecionar    │────►│ Clica        │
│          │     │ Smart Cleanup│     │ categorias    │     │ "Analisar"   │
└─────────┘     └──────────────┘     └───────────────┘     └──────┬───────┘
                                                                    │
                                                                    ▼
                                                            ┌──────────────┐
                                                            │ Backend      │
                                                            │ escaneia     │
                                                            │ categorias   │
                                                            └──────┬───────┘
                                                                    │
                                                                    ▼
                                                            ┌──────────────┐
                                                            │ Lista de     │
                                                            │ candidatos   │
                                                            │ exibida      │
                                                            └──────┬───────┘
                                                                    │
                                          ┌─────────────────────────┤
                                          ▼                         ▼
                                  ┌──────────────┐          ┌──────────────┐
                                  │ Revisar e    │          │ Selecionar   │
                                  │ desmarcar    │          │ todos        │
                                  │ itens        │          │              │
                                  └──────┬───────┘          └──────┬───────┘
                                         │                         │
                                         └────────────┬───────────┘
                                                       ▼
                                               ┌──────────────┐
                                               │ Clica        │
                                               │ "Limpar"     │
                                               └──────┬───────┘
                                                       │
                                                       ▼
                                               ┌──────────────┐
                                               │ Modal de     │
                                               │ confirmação  │
                                               │ (N itens,    │
                                               │  X GB)       │
                                               └──────┬───────┘
                                                       │
                                          ┌────────────┼────────────┐
                                          ▼                         ▼
                                  ┌──────────────┐          ┌──────────────┐
                                  │ Cancelar     │          │ Confirmar    │
                                  │ (volta)      │          │              │
                                  └──────────────┘          └──────┬───────┘
                                                                    │
                                                                    ▼
                                                            ┌──────────────┐
                                                            │ Progress     │
                                                            │ de limpeza   │
                                                            └──────┬───────┘
                                                                    │
                                                                    ▼
                                                            ┌──────────────┐
                                                            │ Resultado:   │
                                                            │ N removidos  │
                                                            │ X GB livres  │
                                                            └──────┬───────┘
                                                                    │
                                                       ┌────────────┼──────┐
                                                       ▼                    ▼
                                               ┌──────────────┐    ┌────────────┐
                                               │ [Desfazer]   │    │   [OK]     │
                                               │ Rollback     │    │   Fim      │
                                               └──────────────┘    └────────────┘
```

### 12.3 Fluxo: Monitorar Recursos

```
┌─────────┐     ┌──────────────┐     ┌───────────────────────────────┐
│  INÍCIO  │────►│ Abrir tela   │────►│ Backend inicia coleta        │
│          │     │ Monitor      │     │ periódica de métricas        │
└─────────┘     └──────────────┘     └──────────────┬────────────────┘
                                                      │
                                                      ▼
                                              ┌──────────────────┐
                                     ┌───────►│ Gráficos         │◄───── Loop a cada
                                     │        │ atualizam com    │       N segundos
                                     │        │ novos dados      │
                                     │        └──────┬───────────┘
                                     │               │
                                     │    ┌──────────┼──────────┐
                                     │    ▼          ▼          ▼
                                     │ ┌────────┐ ┌────────┐ ┌────────────┐
                                     │ │CPU Line│ │RAM Line│ │Disk Bars   │
                                     │ │Chart   │ │Chart   │ │            │
                                     │ └────────┘ └────────┘ └────────────┘
                                     │
                                     │  ┌──────────────┐
                                     └──│ Mudar        │
                                        │ intervalo    │
                                        │ (dropdown)   │
                                        └──────────────┘

  Saída: Navegar para outra tela → Backend para coleta → Gráficos pausam
```

### 12.4 Fluxo: Deletar Arquivo Individual

```
┌─────────┐     ┌──────────────┐     ┌───────────────┐
│ Tela de  │────►│ Identifica   │────►│ Clica menu    │
│ Análise  │     │ arquivo      │     │ ações (⋮)     │
│ ou Top   │     │ grande/      │     │               │
│ Arquivos │     │ desnecessário│     │               │
└─────────┘     └──────────────┘     └──────┬────────┘
                                             │
                                             ▼
                                     ┌───────────────┐
                                     │ Seleciona     │
                                     │ "Deletar"     │
                                     └──────┬────────┘
                                             │
                                             ▼
                                     ┌───────────────────────────────┐
                                     │  MODAL DE CONFIRMAÇÃO         │
                                     │                               │
                                     │  Arquivo: backup-old.zip      │
                                     │  Tamanho: 2.3 GB              │
                                     │  Local: C:\Users\...\Desktop  │
                                     │                               │
                                     │  [x] Enviar para Lixeira      │
                                     │                               │
                                     │  [Cancelar] [Confirmar]       │
                                     └──────────────┬────────────────┘
                                                     │
                                          ┌──────────┼──────────┐
                                          ▼                      ▼
                                  ┌──────────────┐       ┌──────────────┐
                                  │ Cancelar     │       │ Backend      │
                                  │ (fecha modal)│       │ deleta       │
                                  └──────────────┘       └──────┬───────┘
                                                                 │
                                                    ┌────────────┼──────────┐
                                                    ▼                        ▼
                                            ┌──────────────┐        ┌──────────────┐
                                            │ Sucesso      │        │ Erro         │
                                            │ Toast verde  │        │ Toast vermelho│
                                            │ "2.3 GB      │        │ "Arquivo em  │
                                            │  liberados"  │        │  uso"        │
                                            └──────┬───────┘        └──────────────┘
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │ Item removido│
                                            │ da lista     │
                                            │ Registro no  │
                                            │ histórico    │
                                            └──────────────┘
```

---

## 13. Roadmap de Desenvolvimento

### Visão Geral

```
                    Fase 1              Fase 2              Fase 3              Fase 4
                  (MVP Core)         (Avançado)         (Inteligente)        (Enterprise)
               ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
               │  Semanas 1-6 │  │ Semanas 7-12 │  │ Semanas 13-18│  │ Semanas 19-24│
               │              │  │              │  │              │  │              │
               │ Dashboard    │  │ Treemap      │  │ Duplicatas   │  │ Auto-cleanup │
               │ Scan Disco   │  │ Smart Cleanup│  │ Regras Custom│  │ Multi-máquina│
               │ Monitor      │  │ Histórico    │  │ Tour Guiado  │  │ Relatórios   │
               │ Ações Básicas│  │ Top Arquivos │  │ Scheduler    │  │ API REST     │
               │ Configurações│  │ Tooltips Help│  │ FAQ/Help     │  │ Plugins      │
               └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                    ▲                  ▲                  ▲                  ▲
                    │                  │                  │                  │
               RELEASE v1.0       RELEASE v1.5       RELEASE v2.0       RELEASE v3.0
```

### Fase 1 - MVP Core (Semanas 1-6)

**Objetivo:** Produto funcional com features essenciais para uso interno imediato.

| Semana | Sprint | Entregáveis                                                                           |
|--------|--------|---------------------------------------------------------------------------------------|
| 1      | S1     | Setup do projeto (Tauri + React + TypeScript), estrutura de pastas, CI/CD básico      |
|        |        | Design system base (Button, Card, Modal, Layout), tema dark/light                     |
|        |        | Sidebar de navegação, routing, layout principal                                       |
| 2      | S1     | Backend: ScanService com walkdir + rayon, modelo ScanJob                              |
|        |        | Backend: Persistência SQLite (schema, migrações, repositórios)                        |
|        |        | Frontend: Tela de Análise de Disco (seletor de path, botão scan)                      |
| 3      | S2     | Backend: Eventos IPC de progresso, cancelamento de scan                               |
|        |        | Frontend: Progress bar, tabela de resultados, navegação hierárquica                   |
|        |        | Frontend: Breadcrumb, filtro por extensão, ordenação                                  |
| 4      | S2     | Backend: MetricsService com sysinfo (CPU, RAM, Disco)                                 |
|        |        | Backend: ResourceHistory com persistência periódica                                   |
|        |        | Frontend: Monitor de Recursos (line charts CPU/RAM, barras de disco)                  |
| 5      | S3     | Backend: CleanupService (delete to trash, delete permanent)                           |
|        |        | Frontend: Ações básicas (deletar, abrir explorer, copiar caminho)                     |
|        |        | Frontend: Dashboard principal (gauges, cards de disco, alertas)                       |
| 6      | S3     | Backend: SettingsService (load/save JSON)                                             |
|        |        | Frontend: Tela de Configurações completa                                              |
|        |        | Testes, bugfixes, polish de UI, build de release                                      |
|        |        | **RELEASE v1.0.0**                                                                    |

### Fase 2 - Funcionalidades Avançadas (Semanas 7-12)

**Objetivo:** Expandir capacidades com visualizações avançadas, limpeza inteligente e histórico.

| Semana | Sprint | Entregáveis                                                                           |
|--------|--------|---------------------------------------------------------------------------------------|
| 7      | S4     | Backend: Smart cleanup scan (categorias: temp, logs, cache)                           |
|        |        | Frontend: Tela de Limpeza Inteligente (categorias, seleção, preview)                  |
| 8      | S4     | Backend: Execução de cleanup em lote, rollback                                        |
|        |        | Frontend: Modal de confirmação, progress de limpeza, resultado com rollback           |
| 9      | S5     | Frontend: Treemap de disco (Canvas, algoritmo squarified)                             |
|        |        | Frontend: Interação do treemap (zoom, hover, right-click)                             |
| 10     | S5     | Backend: Histórico de ações (queries, filtros, paginação)                             |
|        |        | Frontend: Tela de Histórico (tabela, filtros, detalhes expandidos)                    |
| 11     | S6     | Frontend: Tela de Maiores Arquivos (top N, menu de ações)                             |
|        |        | Frontend: Tooltips contextuais de ajuda (ícones "?")                                  |
| 12     | S6     | Backend: Exportação de relatórios (CSV, JSON)                                         |
|        |        | Testes de integração, performance testing, otimizações                                 |
|        |        | **RELEASE v1.5.0**                                                                    |

### Fase 3 - Inteligência e Automação (Semanas 13-18)

**Objetivo:** Adicionar detecção de duplicatas, regras customizadas, agendamento e help completo.

| Semana | Sprint | Entregáveis                                                                           |
|--------|--------|---------------------------------------------------------------------------------------|
| 13     | S7     | Backend: Hash-based duplicate detection (SHA-256, comparação por tamanho primeiro)    |
|        |        | Frontend: UI de duplicatas (agrupamento, seleção de qual manter)                      |
| 14     | S7     | Backend: Motor de regras customizadas de limpeza                                      |
|        |        | Frontend: Editor de regras (extensão + idade + tamanho + localização)                 |
| 15     | S8     | Backend: SchedulerService (cron-like, agendamento de limpeza)                         |
|        |        | Frontend: Configuração de auto-cleanup (frequência, categorias, limites)              |
| 16     | S8     | Backend: Notificações de sistema (Windows notifications)                              |
|        |        | Frontend: Central de notificações, badge de alertas                                   |
| 17     | S9     | Frontend: Central de Ajuda completa (guias, FAQ, busca)                               |
|        |        | Frontend: Tour guiado de onboarding (primeiro uso)                                    |
| 18     | S9     | Frontend: Atalhos de teclado completos                                                |
|        |        | Testes end-to-end, documentação de API interna, security review                       |
|        |        | **RELEASE v2.0.0**                                                                    |

### Fase 4 - Enterprise e Escalabilidade (Semanas 19-24)

**Objetivo:** Preparar para uso em escala corporativa com monitoramento multi-máquina e extensibilidade.

| Semana | Sprint | Entregáveis                                                                           |
|--------|--------|---------------------------------------------------------------------------------------|
| 19     | S10    | Arquitetura de plugins (API de extensão)                                              |
|        |        | Sistema de auto-update (Tauri updater)                                                |
| 20     | S10    | API REST local para integração com ferramentas de gestão de TI                        |
|        |        | Exportação de relatórios em PDF                                                       |
| 21     | S11    | Coleta de métricas remota (agente leve para estações de trabalho)                     |
|        |        | Dashboard consolidado multi-máquina (visão de frota)                                  |
| 22     | S11    | Políticas de limpeza centralizadas (deploy de regras via servidor)                    |
|        |        | Autenticação e níveis de acesso (admin vs operador)                                   |
| 23     | S12    | Integração com Active Directory / LDAP                                                |
|        |        | Alertas por e-mail / Teams para eventos críticos                                      |
| 24     | S12    | Performance profiling, otimizações finais                                             |
|        |        | Documentação completa para deploy em escala, treinamento                               |
|        |        | **RELEASE v3.0.0**                                                                    |

### Métricas de Sucesso por Fase

| Fase | Métrica                                    | Meta                     |
|------|--------------------------------------------|--------------------------|
| F1   | Tempo de scan de 100 GB                    | < 30 segundos            |
| F1   | Consumo de RAM do TracOS                   | < 80 MB em operação      |
| F1   | Tamanho do instalador                      | < 15 MB                  |
| F2   | Tempo de renderização do treemap (10k nós) | < 500ms                  |
| F2   | Taxa de sucesso de rollback                | > 99%                    |
| F3   | Precisão de detecção de duplicatas         | 100% (hash-based)        |
| F3   | Falsos positivos em sugestão de limpeza    | < 1%                     |
| F4   | Máquinas monitoradas simultaneamente       | > 100                    |
| F4   | Latência de coleta remota                  | < 5 segundos             |

---

## Apêndice A - Glossário

| Termo              | Definição                                                                            |
|---------------------|--------------------------------------------------------------------------------------|
| **IPC**            | Inter-Process Communication - comunicação entre o frontend (WebView) e backend (Rust)|
| **Scan**           | Varredura recursiva de um diretório para mapear arquivos e tamanhos                  |
| **Treemap**        | Visualização que representa hierarquia como blocos aninhados proporcionais ao tamanho |
| **Modo Seguro**    | Configuração que ativa confirmações extras e obriga uso de lixeira                   |
| **Rollback**       | Reverter uma operação de deleção restaurando arquivo da lixeira                      |
| **Smart Cleanup**  | Limpeza baseada em categorias predefinidas (temp, logs, cache)                       |
| **WAL**            | Write-Ahead Log - modo do SQLite que permite leitura e escrita simultâneas           |
| **Ring Buffer**    | Estrutura circular de dados onde novos dados sobrescrevem os mais antigos            |

## Apêndice B - Referências Técnicas

| Recurso                     | URL                                                       |
|-----------------------------|-----------------------------------------------------------|
| Tauri v2 Documentation      | https://v2.tauri.app                                      |
| Rust sysinfo crate          | https://docs.rs/sysinfo                                   |
| Rust walkdir crate          | https://docs.rs/walkdir                                   |
| Recharts Documentation      | https://recharts.org                                      |
| Zustand State Management    | https://docs.pmnd.rs/zustand                              |
| Radix UI Primitives         | https://www.radix-ui.com                                  |
| SQLite WAL Mode             | https://www.sqlite.org/wal.html                           |
| Squarified Treemap Algorithm| Bruls, Huizing, van Wijk (2000)                           |

---

**Documento elaborado pela equipe de Engenharia de Software - Tracbel Agro**
**Classificação: Uso Interno**
**Aprovação pendente: Gestor de TI, Coordenador de Projetos**
