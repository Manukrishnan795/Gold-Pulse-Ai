import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");
    client = new Anthropic({ apiKey });
  }
  return client;
}

// Cheap, fast model for the high-volume per-article analysis pass.
export const ANALYSIS_MODEL = "claude-haiku-4-5-20251001";

// Higher-quality model for the once-a-day aggregation/briefing call.
export const AGGREGATION_MODEL = "claude-sonnet-5";
