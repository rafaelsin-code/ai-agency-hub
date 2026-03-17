import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAgentById,
  agents,
  SQUAD_LABELS,
  SQUAD_COLORS,
} from "@/data/agents";
import AgentAvatar from "@/components/AgentAvatar";

function padNumber(n: number) {
  return String(n).padStart(2, "0");
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = getAgentById(id);

  if (!agent) return notFound();

  const parentAgent =
    agent.reportsTo && agent.reportsTo !== "Rafael (Dono)"
      ? getAgentById(agent.reportsTo)
      : null;

  const subordinates = (agent.directReports ?? [])
    .map((rid) => agents.find((a) => a.id === rid))
    .filter(Boolean) as (typeof agents)[number][];

  const squadColor = SQUAD_COLORS[agent.squad];
  const squadLabel = SQUAD_LABELS[agent.squad];

  // Quality score derived from successRate + avg skill score
  const avgSkill =
    agent.skills.length > 0
      ? Math.round(
          agent.skills.reduce((s, sk) => s + sk.score, 0) /
            agent.skills.length
        )
      : 0;
  const qualityScore = Math.round((agent.stats.successRate + avgSkill) / 2);

  return (
    <div className="min-h-screen p-8 lg:p-12">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-text-muted transition-colors hover:text-text-primary"
        >
          <span>&larr;</span> Voltar
        </Link>

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <AgentAvatar agentId={agent.id} name={agent.name} color={agent.color} size={80} className="rounded-xl" />

            <div className="min-w-0 flex-1">
              {/* Name + number */}
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-text-primary">
                  {agent.name}
                </h1>
                <span
                  className="rounded-md px-2 py-0.5 font-mono text-xs font-semibold"
                  style={{
                    backgroundColor: `${agent.color}22`,
                    color: agent.color,
                  }}
                >
                  #{padNumber(agent.number)}
                </span>
              </div>

              {/* Role */}
              <p className="mt-1 text-sm text-text-muted">{agent.role}</p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${squadColor}20`,
                    color: squadColor,
                  }}
                >
                  {squadLabel}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {agent.model}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="mt-5 text-sm leading-relaxed text-text-muted">
            {agent.description}
          </p>
        </div>

        {/* ── Clone de Genio ── */}
        {agent.cloneDeGenio && (
          <div
            className="mb-8 rounded-xl border p-5"
            style={{ borderColor: `${agent.color}30` }}
          >
            <p
              className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: agent.color }}
            >
              Clone de Genio
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: agent.color }}
            >
              {agent.cloneDeGenio.name}
            </p>
            <p className="mt-1 text-sm italic text-text-muted">
              &ldquo;{agent.cloneDeGenio.quote}&rdquo;
            </p>
          </div>
        )}

        {/* ── Stats Row ── */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Tasks Completadas",
              value: agent.stats.tasksCompleted.toLocaleString(),
              color: "#8B5CF6",
            },
            {
              label: "Taxa Conversao",
              value: `${agent.stats.successRate}%`,
              color: "#22C55E",
            },
            {
              label: "Custo Total",
              value: `$${agent.stats.totalCost.toFixed(2)}`,
              color: "#06B6D4",
            },
            {
              label: "Score Qualidade",
              value: `${qualityScore}/100`,
              color: "#F59E0B",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-bg-card p-5"
            >
              <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                {stat.label}
              </p>
              <p
                className="mt-2 text-2xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Two Column: Habilidades + Especialidades ── */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Habilidades */}
          <div className="rounded-xl bg-bg-card p-6">
            <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
              Habilidades
            </h2>
            <div className="space-y-4">
              {agent.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-text-primary">
                      {skill.name}
                    </span>
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{ color: agent.color }}
                    >
                      {skill.score}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${skill.score}%`,
                        backgroundColor: agent.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Especialidades + Ferramentas */}
          <div className="space-y-6">
            <div className="rounded-xl bg-bg-card p-6">
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
                Especialidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {agent.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border px-3 py-1 text-xs text-text-primary"
                    style={{ borderColor: `${agent.color}50` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-bg-card p-6">
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
                Ferramentas
              </h2>
              <div className="flex flex-wrap gap-2">
                {agent.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Personalidade ── */}
        {agent.personality && (
          <div className="mb-8 rounded-xl bg-bg-card p-6">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
              Personalidade
            </h2>
            <p className="text-sm leading-relaxed text-text-primary">
              {agent.personality}
            </p>
          </div>
        )}

        {/* ── Formato de Output ── */}
        {agent.outputFormat && (
          <div className="mb-8 rounded-xl bg-bg-card p-6">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
              Formato de Output
            </h2>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-bg-surface p-4 font-mono text-xs leading-relaxed text-text-primary">
              {agent.outputFormat}
            </pre>
          </div>
        )}

        {/* ── Hierarquia ── */}
        <div className="mb-8 rounded-xl bg-bg-card p-6">
          <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">
            Hierarquia
          </h2>

          {/* Reporta Para */}
          {agent.reportsTo && (
            <div className="mb-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-dimmed">
                Reporta para
              </p>
              {parentAgent ? (
                <Link
                  href={`/agente/${parentAgent.id}`}
                  className="inline-flex items-center gap-3 rounded-lg border border-white/5 bg-bg-surface px-4 py-3 transition-colors hover:bg-bg-card-hover"
                >
                  <AgentAvatar agentId={parentAgent.id} name={parentAgent.name} color={parentAgent.color} size={32} />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {parentAgent.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {parentAgent.role}
                    </p>
                  </div>
                </Link>
              ) : (
                <span className="text-sm text-text-muted">
                  {agent.reportsTo}
                </span>
              )}
            </div>
          )}

          {/* Subordinados */}
          {subordinates.length > 0 && (
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-dimmed">
                Subordinados diretos
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subordinates.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/agente/${sub.id}`}
                    className="flex items-center gap-3 rounded-lg border border-white/5 bg-bg-surface px-4 py-3 transition-colors hover:bg-bg-card-hover"
                  >
                    <AgentAvatar agentId={sub.id} name={sub.name} color={sub.color} size={32} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {sub.name}
                      </p>
                      <p className="truncate text-xs text-text-muted">
                        {sub.role}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!agent.reportsTo && subordinates.length === 0 && (
            <p className="text-sm text-text-dimmed">
              Nenhuma relacao hierarquica definida.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
