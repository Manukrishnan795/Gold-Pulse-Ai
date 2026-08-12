import { createServerClient } from "../supabase/server";
import { getClaudeClient, AGGREGATION_MODEL } from "../claude/client";
import { DAILY_BRIEF_SYSTEM_PROMPT, DAILY_BRIEF_TOOL } from "../claude/prompts";

interface AnalyzedRow {
  article_id: string;
  gold_driver: string;
  impact: string;
  importance: string;
  summary: string;
  why_it_matters: string;
  volatility_risk: boolean;
  articles: { title: string; source: string; source_url: string; published_at: string } | null;
}

interface DailyBriefToolInput {
  sentiment: string;
  confidence: number;
  market_score: number;
  ai_summary: string;
  bullish_factors: string[];
  bearish_factors: string[];
  what_changed: string | null;
  top_developments: { article_index: number; rank: number }[];
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function runAggregation(): Promise<{ brief_id: string; brief_date: string } | { skipped: string }> {
  const supabase = createServerClient();
  const today = todayDateString();

  const { data: rows, error } = await supabase
    .from("article_analysis")
    .select(
      "article_id, gold_driver, impact, importance, summary, why_it_matters, volatility_risk, articles!article_analysis_article_id_fkey(title, source, source_url, published_at)"
    )
    .eq("is_relevant", true)
    .gte("analyzed_at", `${today}T00:00:00Z`);

  if (error) throw error;
  const analyzed = (rows ?? []) as unknown as AnalyzedRow[];

  if (analyzed.length === 0) {
    return { skipped: "No relevant analyzed articles for today yet." };
  }

  const { data: previousBrief } = await supabase
    .from("daily_briefs")
    .select("*")
    .lt("brief_date", today)
    .order("brief_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const inputList = analyzed
    .map((row, i) => {
      const a = row.articles;
      return `[${i}] ${a?.title ?? "(untitled)"} | source: ${a?.source ?? "?"} | driver: ${row.gold_driver} | impact: ${row.impact} | importance: ${row.importance} | volatility_risk: ${row.volatility_risk}\nSummary: ${row.summary}\nWhy it matters: ${row.why_it_matters}`;
    })
    .join("\n\n");

  const yesterdayContext = previousBrief
    ? `Yesterday's brief (${previousBrief.brief_date}): sentiment=${previousBrief.sentiment}, confidence=${previousBrief.confidence}, market_score=${previousBrief.market_score}, summary="${previousBrief.ai_summary}"`
    : "No prior brief available (first day).";

  const claude = getClaudeClient();
  const message = await claude.messages.create({
    model: AGGREGATION_MODEL,
    max_tokens: 2000,
    system: DAILY_BRIEF_SYSTEM_PROMPT,
    tools: [DAILY_BRIEF_TOOL],
    tool_choice: { type: "tool", name: "submit_daily_brief" },
    messages: [
      {
        role: "user",
        content: `${yesterdayContext}\n\nToday's Gold-relevant developments:\n\n${inputList}`,
      },
    ],
  });

  const toolUse = message.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool_use block");
  }
  const brief = toolUse.input as DailyBriefToolInput;

  const { data: briefRow, error: upsertError } = await supabase
    .from("daily_briefs")
    .upsert(
      {
        brief_date: today,
        sentiment: brief.sentiment,
        confidence: brief.confidence,
        market_score: brief.market_score,
        ai_summary: brief.ai_summary,
        bullish_factors: brief.bullish_factors,
        bearish_factors: brief.bearish_factors,
        what_changed: brief.what_changed,
      },
      { onConflict: "brief_date" }
    )
    .select()
    .single();

  if (upsertError) throw upsertError;

  // Clear any previous development links for this brief (safe to re-run)
  await supabase.from("brief_developments").delete().eq("brief_id", briefRow.id);

  const developmentRows = brief.top_developments
    .filter((d) => analyzed[d.article_index])
    .map((d) => ({
      brief_id: briefRow.id,
      article_id: analyzed[d.article_index].article_id,
      rank: d.rank,
    }));

  if (developmentRows.length > 0) {
    const { error: devError } = await supabase.from("brief_developments").insert(developmentRows);
    if (devError) throw devError;
  }

  return { brief_id: briefRow.id, brief_date: briefRow.brief_date };
}
