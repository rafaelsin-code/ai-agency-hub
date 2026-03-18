import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface GeminiCallOptions {
  model: string;
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface GeminiResponse {
  text: string;
  tokensIn: number;
  tokensOut: number;
  durationMs: number;
}

export async function callGemini(options: GeminiCallOptions): Promise<GeminiResponse> {
  const start = Date.now();

  const model = genAI.getGenerativeModel({
    model: options.model,
    systemInstruction: options.systemPrompt,
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 4096,
      responseMimeType: options.jsonMode ? "application/json" : "text/plain",
    },
  });

  const result = await model.generateContent(options.userMessage);
  const response = result.response;
  const text = response.text();

  const usage = response.usageMetadata;

  return {
    text,
    tokensIn: usage?.promptTokenCount ?? 0,
    tokensOut: usage?.candidatesTokenCount ?? 0,
    durationMs: Date.now() - start,
  };
}

// Model mapping by agent tier
export const TIER_MODELS: Record<string, string> = {
  estrategico: "gemini-2.5-pro",
  operacional: "gemini-2.5-flash",
  execucao: "gemini-2.0-flash-lite",
};

// Cost per 1M tokens (approximate)
export const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  "gemini-2.5-pro": { input: 1.25, output: 10.0 },
  "gemini-2.5-flash": { input: 0.15, output: 0.60 },
  "gemini-2.0-flash-lite": { input: 0.075, output: 0.30 },
};

export function calculateCost(model: string, tokensIn: number, tokensOut: number): number {
  const costs = MODEL_COSTS[model] || MODEL_COSTS["gemini-2.5-flash"];
  return (tokensIn * costs.input + tokensOut * costs.output) / 1_000_000;
}
