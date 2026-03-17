import { mockLogs } from "@/data/logs";

function getLevelStyle(level: string) {
  switch (level) {
    case "WARN":
      return "text-accent-amber bg-accent-amber/15";
    case "ERROR":
      return "text-accent-rose bg-accent-rose/15";
    default:
      return "text-text-muted bg-white/5";
  }
}

export default function LogsPage() {
  return (
    <div className="min-h-screen p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-accent-purple">
            Sistema
          </span>
          <h1 className="text-3xl font-bold text-text-primary lg:text-4xl">
            Logs
          </h1>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-text-muted">
          {mockLogs.length} entries
        </span>
      </div>

      {/* Log Container */}
      <div className="overflow-hidden rounded-xl bg-bg-card">
        {mockLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-4 border-b border-white/5 px-4 py-2.5 font-mono text-xs last:border-b-0"
          >
            {/* Timestamp */}
            <span className="flex-shrink-0 text-text-dimmed">
              {log.timestamp}
            </span>

            {/* Level Badge */}
            <span
              className={`inline-flex w-14 flex-shrink-0 items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${getLevelStyle(log.level)}`}
            >
              {log.level}
            </span>

            {/* Agent Name */}
            <span
              className="w-32 flex-shrink-0 truncate font-semibold uppercase"
              style={{ color: log.color }}
            >
              {log.agentName}
            </span>

            {/* Message */}
            <span className="min-w-0 flex-1 text-text-muted">
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
