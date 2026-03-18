import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/engine/runner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, message, briefing } = body;

    if (!agentId || !message) {
      return NextResponse.json(
        { error: "agentId and message are required" },
        { status: 400 }
      );
    }

    const result = await runAgent({
      agentId,
      userMessage: message,
      briefing: briefing || undefined,
    });

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
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
