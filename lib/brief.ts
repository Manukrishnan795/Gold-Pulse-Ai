import { createPublicClient } from "./supabase/client";
import type { Impact, Importance } from "./types";

export interface NewsArticleView {
  id: string;
  title: string;
  source: string;
  source_url: string;
  published_at: string;
  summary: string;
  why_it_matters: string;
  impact: Impact;
  importance: Importance;
  relevance_score: number;
  gold_driver: string;
}

export async function getAllRelevantArticles(): Promise<NewsArticleView[]> {
  const supabase = createPublicClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("article_analysis")
    .select(
      "relevance_score, impact, importance, summary, why_it_matters, gold_driver, articles!article_analysis_article_id_fkey(id, title, source, source_url, published_at)"
    )
    .eq("is_relevant", true)
    .gte("analyzed_at", `${today}T00:00:00Z`)
    .order("relevance_score", { ascending: false });

  if (error) throw error;

  return (data ?? []).flatMap((row) => {
    const article = row.articles as unknown as {
      id: string;
      title: string;
      source: string;
      source_url: string;
      published_at: string;
    } | null;
    if (!article) return [];
    return [
      {
        id: article.id,
        title: article.title,
        source: article.source,
        source_url: article.source_url,
        published_at: article.published_at,
        summary: row.summary,
        why_it_matters: row.why_it_matters,
        impact: row.impact as Impact,
        importance: row.importance as Importance,
        relevance_score: row.relevance_score,
        gold_driver: row.gold_driver,
      },
    ];
  });
}

export interface StorySourceView {
  title: string;
  source: string;
  source_url: string;
  published_at: string;
}

export interface StoryView {
  rank: number;
  headline: string;
  gold_driver: string;
  impact: "bullish" | "bearish" | "neutral";
  importance: "high" | "medium" | "low";
  summary: string;
  why_it_matters: string;
  source_count: number;
  sources: StorySourceView[];
}

export interface BriefView {
  brief_date: string;
  created_at: string;
  sentiment: string;
  confidence: number;
  market_score: number;
  ai_summary: string;
  bullish_factors: string[];
  bearish_factors: string[];
  what_changed: string | null;
  stories: StoryView[];
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

  const { data: storyRows, error: storyError } = await supabase
    .from("market_stories")
    .select(
      "rank, headline, gold_driver, impact, importance, summary, why_it_matters, source_count, story_articles(articles!story_articles_article_id_fkey(title, source, source_url, published_at))"
    )
    .eq("brief_id", brief.id)
    .order("rank", { ascending: true });

  if (storyError) throw storyError;

  const stories: StoryView[] = (storyRows ?? []).map((row) => {
    const links = row.story_articles as unknown as { articles: StorySourceView | null }[];
    const sources = links
      .map((link) => link.articles)
      .filter((a): a is StorySourceView => a !== null)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    return {
      rank: row.rank,
      headline: row.headline,
      gold_driver: row.gold_driver,
      impact: row.impact as "bullish" | "bearish" | "neutral",
      importance: row.importance as "high" | "medium" | "low",
      summary: row.summary,
      why_it_matters: row.why_it_matters,
      source_count: row.source_count,
      sources,
    };
  });

  return {
    brief_date: brief.brief_date,
    created_at: brief.created_at,
    sentiment: brief.sentiment,
    confidence: brief.confidence,
    market_score: Number(brief.market_score),
    ai_summary: brief.ai_summary,
    bullish_factors: brief.bullish_factors ?? [],
    bearish_factors: brief.bearish_factors ?? [],
    what_changed: brief.what_changed,
    stories,
  };
}
