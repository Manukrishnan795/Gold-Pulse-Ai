export type GoldDriver =
  | "USD"
  | "Fed"
  | "Yields"
  | "Inflation"
  | "Employment"
  | "Geopolitics"
  | "CentralBanks"
  | "ETFs"
  | "Oil"
  | "GlobalGrowth"
  | "RiskSentiment";

export type Impact = "bullish" | "bearish" | "neutral";
export type Importance = "high" | "medium" | "low";
export type ArticleStatus = "pending" | "analyzed" | "rejected" | "duplicate";

export interface Article {
  id: string;
  source: string;
  source_url: string;
  title: string;
  raw_content: string | null;
  content_hash: string;
  published_at: string;
  ingested_at: string;
  status: ArticleStatus;
  created_at: string;
}

export interface ArticleAnalysis {
  id: string;
  article_id: string;
  is_relevant: boolean;
  relevance_score: number;
  gold_driver: GoldDriver;
  impact: Impact;
  importance: Importance;
  summary: string;
  why_it_matters: string;
  volatility_risk: boolean;
  duplicate_of: string | null;
  ai_model: string;
  analyzed_at: string;
  created_at: string;
}

export interface RawFeedItem {
  source: string;
  source_url: string;
  title: string;
  raw_content: string;
  published_at: string;
}
