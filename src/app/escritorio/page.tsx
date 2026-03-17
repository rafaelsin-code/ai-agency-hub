import Link from "next/link";
import { agents } from "@/data/agents";

const activeAgents = agents.filter((a) => a.status !== "em-breve");
const orion = agents.find((a) => a.id === "orion")!;
const otherAgents = activeAgents.filter((a) => a.id !== "orion");

const emBreveSlots = [
  { label: "Próximo agente" },
  { label: "Próximo agente" },
  { label: "Próximo agente" },
];

function AgentAvatar({
  name,
  color,
  size = 64,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-lg font-mono font-bold text-white/90"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}88)`,
        fontSize: size * 0.3,
      }}
    >
      {initials}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "autonomo"
      ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
      : "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.6)]";
  return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;
}

export default function EscritorioPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-purple mb-1">
          Dashboard
        </p>
        <h1 className="text-2xl font-bold text-text-primary">
          Escritório Virtual
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Visualize e gerencie seus agentes de IA em tempo real.
        </p>
      </div>

      {/* ORION Hero Card */}
      <Link href={`/agente/${orion.id}`}>
        <div className="group relative overflow-hidden rounded-xl bg-bg-card p-6 transition-colors hover:bg-bg-card-hover cursor-pointer border border-white/5">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(ellipse at top left, ${orion.color}, transparent 70%)`,
            }}
          />
          <div className="relative flex items-center gap-6">
            <AgentAvatar name={orion.name} color={orion.color} size={80} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-bold text-text-primary tracking-wide">
                  {orion.name}
                </h2>
                {orion.aka && (
                  <span className="text-xs text-text-dimmed font-mono">
                    &quot;{orion.aka}&quot;
                  </span>
                )}
                <StatusDot status={orion.status} />
              </div>
              <p className="text-sm text-text-muted mb-2">{orion.role}</p>
              <p className="text-xs text-text-dimmed leading-relaxed line-clamp-2">
                {orion.description}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-text-dimmed">
              <span className="font-mono">{orion.model}</span>
              <span className="text-accent-green font-semibold">
                {orion.stats.successRate}% sucesso
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {otherAgents.map((agent) => (
          <Link key={agent.id} href={`/agente/${agent.id}`}>
            <div className="group flex flex-col items-center gap-3 rounded-xl bg-bg-card p-5 transition-colors hover:bg-bg-card-hover cursor-pointer border border-white/5 h-full">
              <AgentAvatar name={agent.name} color={agent.color} />
              <div className="text-center min-w-0 w-full">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-text-primary truncate">
                    {agent.name}
                  </p>
                  <StatusDot status={agent.status} />
                </div>
                <p className="text-[11px] text-text-muted truncate">
                  {agent.role}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {/* Em Breve Cards */}
        {emBreveSlots.map((slot, i) => (
          <div
            key={`em-breve-${i}`}
            className="flex flex-col items-center justify-center gap-3 rounded-xl bg-bg-card/50 p-5 border border-white/5 opacity-40 h-full"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/5">
              <svg
                className="h-6 w-6 text-text-dimmed"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-text-dimmed">
                EM BREVE
              </p>
              <p className="text-[11px] text-text-dimmed">{slot.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
