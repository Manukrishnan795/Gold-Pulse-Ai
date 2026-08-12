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

interface MarketStoryToolInput {
  rank: number;
  headline: string;
  member_article_indices: number[];
  gold_driver: string;
  impact: "bullish" | "bearish" | "neutral";
  importance: "high" | "medium" | "low";
  summary: string;
  why_it_matters: string;
}

interface DriverCallout {
  driver: string;
  impact: "bullish" | "bearish" | "neutral";
  note: string;
}

interface WatchItem {
  label: string;
  reason: string;
}

interface OvernightItem {
  headline: string;
  driver: string;
}

interface DailyBriefToolInput {
  sentiment: string;
  confidence: number;
  market_score: number;
  sixty_second_brief: string;
  ai_summary: string;
  bullish_factors: string[];
  bearish_factors: string[];
  market_stories: MarketStoryToolInput[];
  primary_driver: DriverCallout;
  secondary_driver: DriverCallout;
  watch_list: WatchItem[];
  invalidation_note: string;
  overnight_summary: OvernightItem[];
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
  const userMessage = `${yesterdayContext}\n\nToday's Gold-relevant developments:\n\n${inputList}`;

  // Forced tool_choice occasionally omits a required field on a complex schema
  // like this one (empirically observed, not consistently reproducible) — retry
  // a few times rather than letting one bad generation fail the whole cron run.
  const MAX_ATTEMPTS = 3;
  let brief: DailyBriefToolInput | null = null;
  let lastError = "";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS && !brief; attempt++) {
    const message = await claude.messages.create({
      model: AGGREGATION_MODEL,
      max_tokens: 4096,
      system: DAILY_BRIEF_SYSTEM_PROMPT,
      tools: [DAILY_BRIEF_TOOL],
      tool_choice: { type: "tool", name: "submit_daily_brief" },
      messages: [{ role: "user", content: userMessage }],
    });

    const toolUse = message.content.find((block) => block.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      lastError = `attempt ${attempt}: no tool_use block (stop_reason: ${message.stop_reason})`;
      continue;
    }

    const candidate = toolUse.input as DailyBriefToolInput;
    const isValid =
      Array.isArray(candidate.market_stories) &&
      candidate.market_stories.length > 0 &&
      candidate.primary_driver &&
      candidate.secondary_driver &&
      Array.isArray(candidate.watch_list) &&
      candidate.watch_list.length > 0 &&
      typeof candidate.sixty_second_brief === "string" &&
      candidate.sixty_second_brief.length > 0 &&
      Array.isArray(candidate.overnight_summary);

    if (!isValid) {
      lastError = `attempt ${attempt}: missing required field(s) (stop_reason: ${message.stop_reason})`;
      continue;
    }

    brief = candidate;
  }

  if (!brief) {
    throw new Error(`Daily brief generation failed after ${MAX_ATTEMPTS} attempts: ${lastError}`);
  }

  const { data: briefRow, error: upsertError } = await supabase
    .from("daily_briefs")
    .upsert(
      {
        brief_date: today,
        sentiment: brief.sentiment,
        confidence: brief.confidence,
        market_score: brief.market_score,
        sixty_second_brief: brief.sixty_second_brief,
        ai_summary: brief.ai_summary,
        bullish_factors: brief.bullish_factors,
        bearish_factors: brief.bearish_factors,
        primary_driver: brief.primary_driver,
        secondary_driver: brief.secondary_driver,
        watch_list: brief.watch_list,
        invalidation_note: brief.invalidation_note,
        overnight_summary: brief.overnight_summary,
      },
      { onConflict: "brief_date" }
    )
    .select()
    .single();

  if (upsertError) throw upsertError;

  // Clear any previous stories for this brief (safe to re-run — cascades to story_articles)
  await supabase.from("market_stories").delete().eq("brief_id", briefRow.id);

  for (const story of brief.market_stories) {
    const memberArticleIds = story.member_article_indices
      .filter((i) => analyzed[i])
      .map((i) => analyzed[i].article_id);

    if (memberArticleIds.length === 0) continue;

    const { data: storyRow, error: storyError } = await supabase
      .from("market_stories")
      .insert({
        brief_id: briefRow.id,
        rank: story.rank,
        headline: story.headline,
        gold_driver: story.gold_driver,
        impact: story.impact,
        importance: story.importance,
        summary: story.summary,
        why_it_matters: story.why_it_matters,
        source_count: memberArticleIds.length,
      })
      .select()
      .single();

    if (storyError) throw storyError;

    const { error: linkError } = await supabase
      .from("story_articles")
      .insert(memberArticleIds.map((article_id) => ({ story_id: storyRow.id, article_id })));

    if (linkError) throw linkError;
  }

  return { brief_id: briefRow.id, brief_date: briefRow.brief_date };
}
