import { agents } from "@/data/agents";

const activities = [
  { agentId: "orion", action: "Distribuiu briefing para squads de conteúdo e vendas", time: "2 min atrás", type: "handoff" as const },
  { agentId: "copy", action: "Entregou 3 variações de copy para post Instagram", time: "5 min atrás", type: "delivery" as const },
  { agentId: "spark", action: "Gerou 24 ideias de conteúdo para a semana", time: "8 min atrás", type: "delivery" as const },
  { agentId: "eagle", action: "Reprovou roteiro — score 62/100. Devolvido ao STORYTELLER", time: "12 min atrás", type: "review" as const },
  { agentId: "storyteller", action: "Completou roteiro Reels: Hook Magnético", time: "15 min atrás", type: "delivery" as const },
  { agentId: "head-conteudo", action: "Planejou calendário editorial semana 12", time: "20 min atrás", type: "plan" as const },
  { agentId: "hormozi", action: "Consultoria: otimizou oferta do Masterclass", time: "25 min atrás", type: "strategy" as const },
  { agentId: "closer", action: "Schema validation failed — retrying (1/2)", time: "28 min atrás", type: "error" as const },
  { agentId: "builder", action: "Landing page publicada: Masterclass Gratuita", time: "32 min atrás", type: "delivery" as const },
  { agentId: "lens", action: "Relatório semanal gerado: +12% engajamento", time: "35 min atrás", type: "report" as const },
  { agentId: "arturo", action: "3 criativos estáticos + copy de ads entregues", time: "40 min atrás", type: "delivery" as const },
  { agentId: "mailer", action: "Welcome sequence configurada (5 emails)", time: "45 min atrás", type: "delivery" as const },
  { agentId: "sentinel", action: "Compliance check OK — nenhuma violação detectada", time: "50 min atrás", type: "review" as const },
  { agentId: "head-vendas", action: "Pipeline de vendas atualizado: 15 leads quentes", time: "55 min atrás", type: "plan" as const },
  { agentId: "brunson", action: "Consultoria: funil de lançamento redesenhado", time: "1h atrás", type: "strategy" as const },
];

const typeStyles: Record<string, { bg: string; color: string; label: string }> = {
  handoff: { bg: "rgba(139,92,246,0.15)", color: "#8B5CF6", label: "HANDOFF" },
  delivery: { bg: "rgba(34,197,94,0.15)", color: "#22C55E", label: "ENTREGA" },
  review: { bg: "rgba(245,158,11,0.15)", color: "#F59E0B", label: "REVIEW" },
  plan: { bg: "rgba(59,130,246,0.15)", color: "#3B82F6", label: "PLANO" },
  strategy: { bg: "rgba(6,182,212,0.15)", color: "#06B6D4", label: "ESTRATÉGIA" },
  error: { bg: "rgba(244,63,94,0.15)", color: "#F43F5E", label: "ERRO" },
  report: { bg: "rgba(236,72,153,0.15)", color: "#EC4899", label: "RELATÓRIO" },
};

function getAgentName(id: string): { name: string; color: string } {
  const agent = agents.find((a) => a.id === id);
  if (!agent) {
    const arturo = agents.find((a) => a.id === "criacao-ads");
    if (id === "arturo" && arturo) return { name: arturo.name, color: arturo.color };
    return { name: id.toUpperCase(), color: "#64748B" };
  }
  return { name: agent.name, color: agent.color };
}

export default function AtividadePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-purple)" }}>
          Produção
        </p>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Atividade</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Feed em tempo real de todas as ações dos agentes.
        </p>
      </div>

      <div className="space-y-1">
        {activities.map((activity, i) => {
          const agent = getAgentName(activity.agentId);
          const style = typeStyles[activity.type];
          return (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors"
              style={{ background: i % 2 === 0 ? "var(--bg-card)" : "transparent" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: `${agent.color}20`, color: agent.color }}
              >
                {agent.name.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: agent.color }}>
                    {agent.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: style.bg, color: style.color }}>
                    {style.label}
                  </span>
                </div>
                <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
                  {activity.action}
                </p>
              </div>
              <span className="text-xs whitespace-nowrap shrink-0" style={{ color: "var(--text-dimmed)" }}>
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
