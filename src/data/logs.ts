export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  agentId: string;
  agentName: string;
  message: string;
  color: string;
}

export const mockLogs: LogEntry[] = [
  { id: "1", timestamp: "17/03/2026, 18:18:24", level: "INFO", agentId: "orion", agentName: "ORION", message: "Agent orion completed step in pipeline conteudo-semanal (3.1s)", color: "#8B5CF6" },
  { id: "2", timestamp: "17/03/2026, 18:17:39", level: "INFO", agentId: "hormozi", agentName: "HORMOZI", message: "Agent hormozi completed step in pipeline conteudo-semanal (0.8s)", color: "#3B82F6" },
  { id: "3", timestamp: "17/03/2026, 18:16:54", level: "WARN", agentId: "brunson", agentName: "BRUNSON", message: "Token usage at 82% of daily limit", color: "#3B82F6" },
  { id: "4", timestamp: "17/03/2026, 18:16:09", level: "INFO", agentId: "icaro", agentName: "ICARO", message: "Agent icaro completed step in pipeline conteudo-semanal (2.0s)", color: "#3B82F6" },
  { id: "5", timestamp: "17/03/2026, 18:15:24", level: "INFO", agentId: "atlas", agentName: "ATLAS", message: "Agent atlas completed step in pipeline conteudo-semanal (1.4s)", color: "#8B5CF6" },
  { id: "6", timestamp: "17/03/2026, 18:14:39", level: "ERROR", agentId: "head-vendas", agentName: "HEAD VENDAS", message: "Schema validation failed for head-vendas – retrying (2/2)", color: "#EF4444" },
  { id: "7", timestamp: "17/03/2026, 18:13:54", level: "INFO", agentId: "head-conteudo", agentName: "HEAD CONTEÚDO", message: "Agent head-conteudo completed step in pipeline conteudo-semanal (2.6s)", color: "#F97316" },
  { id: "8", timestamp: "17/03/2026, 18:13:09", level: "INFO", agentId: "head-social", agentName: "HEAD SOCIAL", message: "Agent head-social completed step in pipeline conteudo-semanal (1.6s)", color: "#EC4899" },
  { id: "9", timestamp: "17/03/2026, 18:12:24", level: "INFO", agentId: "head-ads", agentName: "HEAD ADS", message: "Agent head-ads completed step in pipeline conteudo-semanal (2.3s)", color: "#EAB308" },
  { id: "10", timestamp: "17/03/2026, 18:11:39", level: "INFO", agentId: "head-tecnologia", agentName: "HEAD TECH", message: "Agent head-tech completed step in pipeline conteudo-semanal (2.1s)", color: "#06B6D4" },
  { id: "11", timestamp: "17/03/2026, 18:10:54", level: "WARN", agentId: "head-financeiro", agentName: "HEAD FINANCEIRO", message: "Token usage at 82% of daily limit", color: "#F59E0B" },
  { id: "12", timestamp: "17/03/2026, 18:10:09", level: "INFO", agentId: "head-operacoes", agentName: "HEAD OPS", message: "Agent head-ops completed step in pipeline conteudo-semanal (1.4s)", color: "#22C55E" },
  { id: "13", timestamp: "17/03/2026, 18:09:24", level: "INFO", agentId: "outbound", agentName: "OUTBOUND", message: "Agent outbound completed step in pipeline conteudo-semanal (1.7s)", color: "#EF4444" },
  { id: "14", timestamp: "17/03/2026, 18:08:39", level: "INFO", agentId: "inbound", agentName: "INBOUND", message: "Agent inbound completed step in pipeline conteudo-semanal (2.6s)", color: "#EF4444" },
  { id: "15", timestamp: "17/03/2026, 18:07:54", level: "ERROR", agentId: "closer", agentName: "CLOSER", message: "Schema validation failed for closer – retrying (1/2)", color: "#EF4444" },
  { id: "16", timestamp: "17/03/2026, 18:07:09", level: "INFO", agentId: "spark", agentName: "SPARK", message: "Agent spark completed step in pipeline conteudo-semanal (2.0s)", color: "#F97316" },
  { id: "17", timestamp: "17/03/2026, 18:06:24", level: "INFO", agentId: "copy", agentName: "COPY", message: "Agent copy completed step in pipeline conteudo-semanal (1.4s)", color: "#F97316" },
  { id: "18", timestamp: "17/03/2026, 18:05:39", level: "INFO", agentId: "storyteller", agentName: "STORYTELLER", message: "Agent storyteller completed step in pipeline conteudo-semanal (2.7s)", color: "#F97316" },
  { id: "19", timestamp: "17/03/2026, 18:04:54", level: "INFO", agentId: "clock", agentName: "CLOCK", message: "Agent clock completed step in pipeline conteudo-semanal (1.9s)", color: "#EC4899" },
  { id: "20", timestamp: "17/03/2026, 18:04:09", level: "INFO", agentId: "lens", agentName: "LENS", message: "Agent lens completed step in pipeline conteudo-semanal (3.1s)", color: "#EC4899" },
];
