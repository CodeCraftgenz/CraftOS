/// Ajuda e Educação — guia de uso

import { useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    className={`text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const iconStyle = "w-5 h-5 text-primary-light";

const helpSections: HelpSection[] = [
  {
    id: "liberar-espaco", title: "Como liberar espaço em disco",
    icon: <svg className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
    content: [
      "1. Acesse 'Análise de Disco' e execute um scan.",
      "2. Verifique as maiores pastas e arquivos.",
      "3. Use 'Limpeza Inteligente' para sugestões automáticas.",
      "4. Limpe arquivos temporários (Temp do Windows e do usuário).",
      "5. Verifique a pasta Downloads.",
      "6. Arquivos grandes antigos podem ser movidos para discos externos.",
      "7. Use o modo seguro (lixeira) para excluir com segurança.",
    ],
  },
  {
    id: "graficos", title: "Como interpretar os gráficos",
    icon: <svg className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    content: [
      "CPU: Percentual de uso do processador em tempo real.",
      "  Verde (0-50%): Uso normal.",
      "  Amarelo (50-75%): Uso moderado.",
      "  Laranja (75-90%): Uso alto, pode haver lentidão.",
      "  Vermelho (90-100%): Uso crítico.",
      "",
      "RAM: Uso de memória.",
      "  Verde: Memória suficiente.",
      "  Vermelho: Memória quase esgotada.",
      "",
      "Disco: Barras mostram espaço usado vs disponível.",
      "  Discos acima de 85% precisam de atenção.",
    ],
  },
  {
    id: "cpu-ram", title: "O que é CPU e RAM?",
    icon: <svg className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /></svg>,
    content: [
      "CPU (Processador): O 'cérebro' do computador.",
      "  Executa todas as operações e cálculos.",
      "  Uso alto = muitos programas rodando.",
      "",
      "RAM (Memória): A 'mesa de trabalho'.",
      "  Guarda dados dos programas abertos.",
      "  Se acabar, o Windows usa o disco (muito mais lento).",
      "  Solução: Feche abas e programas não usados.",
    ],
  },
  {
    id: "boas-praticas", title: "Boas práticas de manutenção",
    icon: <svg className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    content: [
      "1. Execute um scan pelo menos uma vez por semana.",
      "2. Limpe a pasta Temp regularmente.",
      "3. Mantenha pelo menos 10% do disco livre.",
      "4. Mova arquivos grandes para discos de rede.",
      "5. Não acumule downloads.",
      "6. Verifique atualizações do Windows pendentes.",
      "7. Use o histórico do TracOS para acompanhar.",
    ],
  },
  {
    id: "privacidade", title: "Privacidade e segurança",
    icon: <svg className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    content: [
      "O TracOS opera APENAS localmente.",
      "Nenhum dado é enviado para servidores externos.",
      "Todas as informações ficam no seu computador.",
      "",
      "Sobre exclusão:",
      "  Modo seguro (padrão) envia para a Lixeira.",
      "  Você pode restaurar da Lixeira.",
      "  Modo permanente NÃO pode ser revertido.",
    ],
  },
  {
    id: "treemap", title: "Como usar o Mapa Visual",
    icon: <svg className={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="12" y1="3" x2="12" y2="12" /></svg>,
    content: [
      "O Treemap mostra uso de disco como retângulos proporcionais.",
      "Quanto MAIOR o retângulo, MAIS espaço ocupa.",
      "",
      "Como navegar:",
      "  1. Execute um scan na Análise de Disco.",
      "  2. Acesse 'Mapa Visual'.",
      "  3. Clique em um retângulo para navegar.",
      "  4. Use o breadcrumb para voltar.",
    ],
  },
];

const PageHelpIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export function Help() {
  const [expandedId, setExpandedId] = useState<string | null>("liberar-espaco");

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <PageHeader title="Ajuda e Educação" subtitle="Guia de uso e boas práticas" icon={PageHelpIcon} />

      <div className="space-y-2">
        {helpSections.map((section) => (
          <div key={section.id} className="card-static overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-bg-card-hover transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <span className="text-[14px] font-medium text-text-primary">{section.title}</span>
              </div>
              <ChevronIcon open={expandedId === section.id} />
            </button>

            {expandedId === section.id && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="bg-bg-app/50 rounded-xl p-4 border border-border/50">
                  {section.content.map((line, i) => (
                    <p key={i} className={`text-[13px] leading-relaxed ${
                      line === "" ? "h-3"
                        : line.startsWith("  ") ? "text-text-muted ml-4" : "text-text-primary"
                    } ${i > 0 ? "mt-0.5" : ""}`}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
