import { createPublicClient } from "./supabase/client";

export interface DevelopmentView {
  rank: number;
  title: string;
  source: string;
  source_url: string;
  published_at: string;
  summary: string;
  why_it_matters: string;
  impact: "bullish" | "bearish" | "neutral";
  importance: "high" | "medium" | "low";
  gold_driver: string;
}

export interface BriefView {
  brief_date: string;
  sentiment: string;
  confidence: number;
  market_score: number;
  ai_summary: string;
  bullish_factors: string[];
  bearish_factors: string[];
  what_changed: string | null;
  developments: DevelopmentView[];
}

export async function getLatestBrief(): Promise<BriefView | null> {
  const supabase = createPublicClient();

  const { data: brief } = await supabase
    .from("daily_briefs")
    .select("*")
    .order("brief_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!brief) return null;

  const { data: devRows, error: devError } = await supabase
    .from("brief_developments")
    .select(
      "rank, articles!brief_developments_article_id_fkey(title, source, source_url, published_at, article_analysis!article_analysis_article_id_fkey(summary, why_it_matters, impact, importance, gold_driver))"
    )
    .eq("brief_id", brief.id)
    .order("rank", { ascending: true });

  if (devError) throw devError;

  const developments: DevelopmentView[] = (devRows ?? []).flatMap((row) => {
    const article = row.articles as unknown as {
      title: string;
      source: string;
      source_url: string;
      published_at: string;
      article_analysis: {
        summary: string;
        why_it_matters: string;
        impact: "bullish" | "bearish" | "neutral";
        importance: "high" | "medium" | "low";
        gold_driver: string;
      }[];
    } | null;
    const analysis = article?.article_analysis?.[0];
    if (!article || !analysis) return [];
    return [
      {
        rank: row.rank,
        title: article.title,
        source: article.source,
        source_url: article.source_url,
        published_at: article.published_at,
        summary: analysis.summary,
        why_it_matters: analysis.why_it_matters,
        impact: analysis.impact,
        importance: analysis.importance,
        gold_driver: analysis.gold_driver,
      },
    ];
  });

  return {
    brief_date: brief.brief_date,
    sentiment: brief.sentiment,
    confidence: brief.confidence,
    market_score: Number(brief.market_score),
    ai_summary: brief.ai_summary,
    bullish_factors: brief.bullish_factors ?? [],
    bearish_factors: brief.bearish_factors ?? [],
    what_changed: brief.what_changed,
    developments,
  };
}
