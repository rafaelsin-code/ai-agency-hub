import Link from "next/link";
import { agents, getSquadGroups, SQUAD_COLORS, type SquadName } from "@/data/agents";
import AgentAvatar from "@/components/AgentAvatar";

function StatusBadge({ status }: { status: string }) {
  if (status === "autonomo") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-400">
        Autônomo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
      Operador
    </span>
  );
}

export default function AgentesPage() {
  const squadGroups = getSquadGroups();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-purple mb-1">
          Time de IA
        </p>
        <h1 className="text-2xl font-bold text-text-primary">Agentes</h1>
        <p className="text-sm text-text-muted mt-1 max-w-xl">
          Seu time de agentes IA. Cada um é um especialista. Juntos, formam sua
          agência completa.
        </p>
      </div>

      {/* Squads */}
      {squadGroups.map((group) => (
        <section key={group.squad}>
          {/* Squad Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: SQUAD_COLORS[group.squad] }}
            />
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: SQUAD_COLORS[group.squad] }}
            >
              {group.label}
            </h2>
            <div className="flex-1 border-t border-white/5" />
            <span className="text-xs text-text-dimmed font-mono">
              {group.agents.length} agente{group.agents.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {group.agents.map((agent) => (
              <Link key={agent.id} href={`/agente/${agent.id}`}>
                <div className="group relative flex gap-4 rounded-xl bg-bg-card p-5 transition-colors hover:bg-bg-card-hover cursor-pointer border border-white/5">
                  {/* Avatar */}
                  <AgentAvatar agentId={agent.id} name={agent.name} color={agent.color} size={48} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-text-primary truncate">
                        {agent.name}
                      </h3>
                      <StatusBadge status={agent.status} />
                      {agent.status === "autonomo" && (
                        <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                      )}
                    </div>
                    <p className="text-xs text-text-muted mb-2">{agent.role}</p>
                    <p className="text-xs text-text-dimmed leading-relaxed line-clamp-2">
                      {agent.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
