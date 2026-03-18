import fs from "fs";
import path from "path";
import { callGemini, TIER_MODELS, calculateCost } from "@/integrations/gemini";
import { agents } from "@/data/agents";

export interface AgentRunInput {
  agentId: string;
  userMessage: string;
  context?: Record<string, unknown>;
  briefing?: string;
}

export interface AgentRunResult {
  agentId: string;
  output: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  durationMs: number;
  model: string;
  success: boolean;
  error?: string;
}

function loadPrompt(agentId: string): string {
  // Map agent id to folder number
  const agent = agents.find(a => a.id === agentId);
  if (!agent) throw new Error(`Agent not found: ${agentId}`);

  const folderName = `${String(agent.number).padStart(2, "0")}-${agentId}`;
  const promptPath = path.join(process.cwd(), "src", "agents", folderName, "prompt.md");

  if (!fs.existsSync(promptPath)) {
    // Fallback: use agent data to generate a basic prompt
    return generateFallbackPrompt(agent);
  }

  return fs.readFileSync(promptPath, "utf-8");
}

function generateFallbackPrompt(agent: typeof agents[number]): string {
  return `# ${agent.name} — ${agent.role}

## IDENTIDADE
Você é ${agent.name}, ${agent.role} da agência digital AI Agency Hub.
${agent.personality || ""}

## EXPERTISE
${agent.specialties.join(", ")}

## CLONE DE GÊNIO
${agent.cloneDeGenio ? `Você pensa e age como ${agent.cloneDeGenio.name}. "${agent.cloneDeGenio.quote}"` : ""}

## REGRAS
- Responda SEMPRE em português brasileiro
- Seja direto e profissional
- Entregue resultados concretos, não generalidades
- Formato de output: ${agent.outputFormat || "texto estruturado"}

## FERRAMENTAS DISPONÍVEIS
${agent.tools.join(", ")}
`;
}

export async function runAgent(input: AgentRunInput): Promise<AgentRunResult> {
  const agent = agents.find(a => a.id === input.agentId);
  if (!agent) {
    return {
      agentId: input.agentId,
      output: "",
      tokensIn: 0,
      tokensOut: 0,
      costUsd: 0,
      durationMs: 0,
      model: "",
      success: false,
      error: `Agent not found: ${input.agentId}`,
    };
  }

  const model = TIER_MODELS[agent.tier] || "gemini-2.5-flash";
  const systemPrompt = loadPrompt(input.agentId);

  // Build user message with context
  let userMessage = "";
  if (input.briefing) {
    userMessage += `## BRIEFING ATIVO\n${input.briefing}\n\n`;
  }
  if (input.context && Object.keys(input.context).length > 0) {
    userMessage += `## CONTEXTO (outputs de agentes anteriores)\n${JSON.stringify(input.context, null, 2)}\n\n`;
  }
  userMessage += `## TAREFA\n${input.userMessage}`;

  try {
    const response = await callGemini({
      model,
      systemPrompt,
      userMessage,
      temperature: 0.7,
      maxTokens: 4096,
    });

    const costUsd = calculateCost(model, response.tokensIn, response.tokensOut);

    return {
      agentId: input.agentId,
      output: response.text,
      tokensIn: response.tokensIn,
      tokensOut: response.tokensOut,
      costUsd,
      durationMs: response.durationMs,
      model,
      success: true,
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);

    // Retry once on failure
    try {
      const retryResponse = await callGemini({
        model,
        systemPrompt,
        userMessage: userMessage + `\n\n[NOTA: tentativa anterior falhou com erro: ${errMsg}. Tente novamente.]`,
        temperature: 0.5,
        maxTokens: 4096,
      });

      const costUsd = calculateCost(model, retryResponse.tokensIn, retryResponse.tokensOut);

      return {
        agentId: input.agentId,
        output: retryResponse.text,
        tokensIn: retryResponse.tokensIn,
        tokensOut: retryResponse.tokensOut,
        costUsd,
        durationMs: retryResponse.durationMs,
        model,
        success: true,
      };
    } catch (retryError) {
      return {
        agentId: input.agentId,
        output: "",
        tokensIn: 0,
        tokensOut: 0,
        costUsd: 0,
        durationMs: 0,
        model,
        success: false,
        error: `Failed after retry: ${retryError instanceof Error ? retryError.message : String(retryError)}`,
      };
    }
  }
}
