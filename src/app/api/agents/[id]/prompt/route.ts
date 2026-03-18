import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { agents } from "@/data/agents";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const folderName = `${String(agent.number).padStart(2, "0")}-${id}`;
  const promptPath = path.join(process.cwd(), "src", "agents", folderName, "prompt.md");

  try {
    const content = fs.readFileSync(promptPath, "utf-8");
    return NextResponse.json({ prompt: content });
  } catch {
    return NextResponse.json({ prompt: "Prompt ainda não configurado para este agente." });
  }
}
