import {
  Users,
  CheckCircle,
  Zap,
  Star,
  ExternalLink,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { agents } from "@/data/agents";
import AgentAvatar from "@/components/AgentAvatar";

const kpis = [
  {
    label: "Agentes Ativos",
    value: 32,
    icon: Users,
    borderColor: "border-accent-purple",
    iconColor: "text-accent-purple",
  },
  {
    label: "Entregas Hoje",
    value: 12,
    icon: CheckCircle,
    borderColor: "border-accent-green",
    iconColor: "text-accent-green",
  },
  {
    label: "Missões Ativas",
    value: 3,
    icon: Zap,
    borderColor: "border-accent-cyan",
    iconColor: "text-accent-cyan",
  },
  {
    label: "Total Materiais",
    value: 847,
    icon: Star,
    borderColor: "border-accent-amber",
    iconColor: "text-accent-amber",
  },
];

type ActivityStatus = "PRONTO" | "EM ANDAMENTO" | "ERRO";

interface ActivityItem {
  agentId: string;
  message: string;
  timestamp: string;
  status: ActivityStatus;
}

const recentActivity: ActivityItem[] = [
  {
    agentId: "copy",
    message: "Gerou 3 variações de copy para página de captura",
    timestamp: "há 12 min",
    status: "PRONTO",
  },
  {
    agentId: "spark",
    message: "Criando briefing de conteúdo semanal — pilar Educativo",
    timestamp: "há 28 min",
    status: "EM ANDAMENTO",
  },
  {
    agentId: "builder",
    message: "Landing page V2 publicada com novo CTA glow",
    timestamp: "há 1h",
    status: "PRONTO",
  },
  {
    agentId: "eagle",
    message: "Falha na verificação de compliance — claim proibido detectado",
    timestamp: "há 2h",
    status: "ERRO",
  },
  {
    agentId: "orion",
    message: "Distribuiu missão 'Lançamento Módulo 5' para 4 squads",
    timestamp: "há 3h",
    status: "PRONTO",
  },
];

const quickActions = [
  "Configurar briefing do cliente",
  "Rodar Máquina de Criativos",
  "Criar páginas de captura",
  "Configurar email sequences",
];

function getStatusBadge(status: ActivityStatus) {
  const styles: Record<ActivityStatus, string> = {
    PRONTO: "bg-accent-green/15 text-accent-green",
    "EM ANDAMENTO": "bg-accent-amber/15 text-accent-amber",
    ERRO: "bg-accent-rose/15 text-accent-rose",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}


export default function Home() {
  return (
    <div className="min-h-screen p-8 lg:p-12">
      {/* Header */}
      <div className="mb-10">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-accent-purple">
          Dashboard
        </span>
        <h1 className="text-3xl font-bold text-text-primary lg:text-4xl">
          Super Aprendizagem
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Visão geral da produção e status dos agentes para este cliente.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`rounded-xl border-t-2 ${kpi.borderColor} bg-bg-card p-6`}
            >
              <Icon className={`mb-3 h-5 w-5 ${kpi.iconColor} opacity-60`} />
              <p className="text-3xl font-bold text-text-primary">
                {kpi.value}
              </p>
              <p className="mt-1 text-sm text-text-muted">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Atividade Recente — 2/3 */}
        <div className="rounded-xl bg-bg-card p-6 xl:col-span-2">
          <h2 className="mb-5 text-lg font-semibold text-text-primary">
            Atividade Recente
          </h2>

          <div className="space-y-4">
            {recentActivity.map((item, i) => {
              const agent = agents.find((a) => a.id === item.agentId);
              if (!agent) return null;

              return (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-lg border border-white/5 bg-bg-surface p-4 transition-colors hover:bg-bg-card-hover"
                >
                  {/* Avatar */}
                  <AgentAvatar agentId={agent.id} name={agent.name} color={agent.color} size={40} className="rounded-full" />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">
                        {agent.name}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="mt-0.5 text-sm text-text-muted">
                      {item.message}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span className="flex-shrink-0 text-xs text-text-dimmed">
                    {item.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acesso Rápido — 1/3 */}
        <div className="space-y-6">
          {/* Google Drive */}
          <div className="rounded-xl bg-bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              Acesso Rápido
            </h2>

            <a
              href="#"
              className="flex items-center gap-4 rounded-lg border border-white/5 bg-bg-surface p-4 transition-colors hover:bg-bg-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-amber/15">
                <FolderOpen className="h-5 w-5 text-accent-amber" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Google Drive
                </p>
                <p className="text-xs text-text-muted">
                  Abrir pasta de materiais do cliente
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-text-dimmed" />
            </a>
          </div>

          {/* Próximas Ações */}
          <div className="rounded-xl bg-bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              Próximas Ações
            </h2>

            <ul className="space-y-3">
              {quickActions.map((action) => (
                <li key={action}>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg border border-white/5 bg-bg-surface px-4 py-3 text-sm text-text-muted transition-colors hover:bg-bg-card-hover hover:text-text-primary"
                  >
                    <ChevronRight className="h-4 w-4 text-accent-purple" />
                    {action}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
