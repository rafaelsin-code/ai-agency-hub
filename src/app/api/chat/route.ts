import { NextRequest, NextResponse } from "next/server";
import { runSingleAgent, orchestrate } from "@/engine/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, message, briefing, chain } = body;

    if (!agentId || !message) {
      return NextResponse.json(
        { error: "agentId and message are required" },
        { status: 400 }
      );
    }

    // If chain=true or agent is ORION, orchestrate through multiple agents
    if (chain || agentId === "orion") {
      const result = await orchestrate(message, briefing);

      return NextResponse.json({
        agentId,
        response: result.finalOutput,
        steps: result.steps.map(s => ({
          agentId: s.agentId,
          agentName: s.agentName,
          status: s.status,
          output: s.output?.slice(0, 500), // truncate for response size
          durationMs: s.durationMs,
          costUsd: s.costUsd,
        })),
        totalCost: result.totalCost,
        totalDuration: result.totalDuration,
        orchestrated: true,
      });
    }

    // Single agent execution
    const result = await runSingleAgent(agentId, message, briefing);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      agentId: result.agentId,
      response: result.output,
      model: result.model,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      costUsd: result.costUsd,
      durationMs: result.durationMs,
      orchestrated: false,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
