import { createServerClient } from "../supabase/server";
import { getClaudeClient, ANALYSIS_MODEL } from "../claude/client";
import { ARTICLE_ANALYSIS_SYSTEM_PROMPT, ARTICLE_ANALYSIS_TOOL } from "../claude/prompts";
import type { Article } from "../types";

const BATCH_SIZE = 30;

interface AnalysisToolInput {
  is_relevant: boolean;
  relevance_score: number;
  gold_driver: string;
  impact: "bullish" | "bearish" | "neutral";
  importance: "high" | "medium" | "low";
  summary: string;
  why_it_matters: string;
  volatility_risk: boolean;
}

async function analyzeOne(article: Article): Promise<AnalysisToolInput> {
  const claude = getClaudeClient();

  const message = await claude.messages.create({
    model: ANALYSIS_MODEL,
    max_tokens: 500,
    system: ARTICLE_ANALYSIS_SYSTEM_PROMPT,
    tools: [ARTICLE_ANALYSIS_TOOL],
    tool_choice: { type: "tool", name: "submit_gold_analysis" },
    messages: [
      {
        role: "user",
        content: `Title: ${article.title}\n\nSource: ${article.source}\n\nContent: ${article.raw_content ?? "(no body text, analyze from title only)"}`,
      },
    ],
  });

  const toolUse = message.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use block");
  }

  return toolUse.input as AnalysisToolInput;
}

export interface AnalyzeResult {
  processed: number;
  relevant: number;
  rejected: number;
  errors: number;
}

export async function runAnalysis(): Promise<AnalyzeResult> {
  const supabase = createServerClient();
  const result: AnalyzeResult = { processed: 0, relevant: 0, rejected: 0, errors: 0 };

  const { data: pending, error: fetchError } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "pending")
    .order("published_at", { ascending: false })
    .limit(BATCH_SIZE);

  if (fetchError) throw fetchError;
  if (!pending || pending.length === 0) return result;

  for (const article of pending as Article[]) {
    try {
      const analysis = await analyzeOne(article);
      result.processed++;

      const { error: insertError } = await supabase.from("article_analysis").insert({
        article_id: article.id,
        is_relevant: analysis.is_relevant,
        relevance_score: analysis.relevance_score,
        gold_driver: analysis.gold_driver,
        impact: analysis.impact,
        importance: analysis.importance,
        summary: analysis.summary,
        why_it_matters: analysis.why_it_matters,
        volatility_risk: analysis.volatility_risk,
        ai_model: ANALYSIS_MODEL,
      });
      if (insertError) throw insertError;

      const newStatus = analysis.is_relevant ? "analyzed" : "rejected";
      await supabase.from("articles").update({ status: newStatus }).eq("id", article.id);

      if (analysis.is_relevant) result.relevant++;
      else result.rejected++;
    } catch (err) {
      result.errors++;
      console.error(`Analysis failed for article ${article.id}:`, err);
    }
  }

  return result;
}
