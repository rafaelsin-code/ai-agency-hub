import { runAgent, AgentRunResult } from "./runner";
import { agents } from "@/data/agents";

export interface OrchestrationStep {
  agentId: string;
  agentName: string;
  status: "pending" | "running" | "completed" | "failed";
  input: string;
  output?: string;
  durationMs?: number;
  costUsd?: number;
}

export interface OrchestrationResult {
  steps: OrchestrationStep[];
  finalOutput: string;
  totalCost: number;
  totalDuration: number;
}

// Define which agents ORION should consult based on task type
function detectTaskType(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("reel") || lower.includes("roteiro") || lower.includes("conteúdo") || lower.includes("conteudo") || lower.includes("post") || lower.includes("copy") || lower.includes("texto")) return "conteudo";
  if (lower.includes("ads") || lower.includes("anúncio") || lower.includes("anuncio") || lower.includes("campanha") || lower.includes("criativo")) return "ads";
  if (lower.includes("venda") || lower.includes("lead") || lower.includes("prospecção") || lower.includes("prospeccao") || lower.includes("email sequence")) return "vendas";
  if (lower.includes("landing") || lower.includes("página") || lower.includes("pagina") || lower.includes("site")) return "tech";
  if (lower.includes("email") || lower.includes("welcome") || lower.includes("nurturing")) return "email";
  return "geral";
}

// Get the chain of agents for a task type
function getChain(taskType: string): string[][] {
  // Each sub-array runs in parallel, arrays run sequentially
  switch (taskType) {
    case "conteudo":
      return [
        ["orion"],           // Step 1: ORION analisa
        ["hormozi", "icaro"], // Step 2: Conselheiros (paralelo)
        ["head-conteudo"],    // Step 3: Head planeja
        ["spark"],            // Step 4: Ideação
        ["copy", "storyteller"], // Step 5: Execução (paralelo)
        ["eagle"],            // Step 6: QA
      ];
    case "ads":
      return [
        ["orion"],
        ["hormozi", "brunson"],
        ["head-ads"],
        ["criacao-ads", "copy"],
        ["scale"],
        ["eagle"],
      ];
    case "vendas":
      return [
        ["orion"],
        ["hormozi"],
        ["head-vendas"],
        ["outbound", "inbound"],
        ["closer"],
        ["eagle"],
      ];
    case "tech":
      return [
        ["orion"],
        ["brunson"],
        ["head-tecnologia"],
        ["builder"],
        ["eagle"],
      ];
    case "email":
      return [
        ["orion"],
        ["icaro"],
        ["copy"],
        ["mailer"],
        ["eagle"],
      ];
    default:
      return [
        ["orion"],
        ["hormozi", "brunson", "icaro"],
      ];
  }
}

export async function orchestrate(
  message: string,
  briefing?: string,
  onStep?: (step: OrchestrationStep) => void
): Promise<OrchestrationResult> {
  const taskType = detectTaskType(message);
  const chain = getChain(taskType);

  const allSteps: OrchestrationStep[] = [];
  const context: Record<string, unknown> = {};
  let totalCost = 0;
  let totalDuration = 0;

  for (const parallelGroup of chain) {
    // Run agents in parallel within each group
    const promises = parallelGroup.map(async (agentId) => {
      const agent = agents.find(a => a.id === agentId);
      const step: OrchestrationStep = {
        agentId,
        agentName: agent?.name || agentId.toUpperCase(),
        status: "running",
        input: message,
      };

      allSteps.push(step);
      onStep?.(step);

      const result = await runAgent({
        agentId,
        userMessage: message,
        context: Object.keys(context).length > 0 ? context : undefined,
        briefing,
      });

      step.status = result.success ? "completed" : "failed";
      step.output = result.output;
      step.durationMs = result.durationMs;
      step.costUsd = result.costUsd;

      totalCost += result.costUsd;
      totalDuration += result.durationMs;

      // Add output to context for next agents
      context[agentId] = result.output;

      onStep?.(step);

      return result;
    });

    await Promise.all(promises);
  }

  // Final output is the last completed step's output
  const lastStep = [...allSteps].reverse().find(s => s.status === "completed");

  return {
    steps: allSteps,
    finalOutput: lastStep?.output || "Pipeline não produziu output.",
    totalCost,
    totalDuration,
  };
}

// Simple single-agent execution (for individual tasks)
export async function runSingleAgent(
  agentId: string,
  message: string,
  briefing?: string
): Promise<AgentRunResult> {
  return runAgent({ agentId, userMessage: message, briefing });
}
