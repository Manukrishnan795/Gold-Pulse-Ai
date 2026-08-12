import { createPublicClient } from "./supabase/client";

export interface PipelineStats {
  totalIngested: number;
  relevantCount: number;
  hasData: boolean;
}

export async function getPipelineStats(): Promise<PipelineStats> {
  const supabase = createPublicClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ count: totalIngested }, { count: relevantCount }] = await Promise.all([
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .gte("ingested_at", `${today}T00:00:00Z`),
    supabase
      .from("article_analysis")
      .select("id", { count: "exact", head: true })
      .eq("is_relevant", true)
      .gte("analyzed_at", `${today}T00:00:00Z`),
  ]);

  return {
    totalIngested: totalIngested ?? 0,
    relevantCount: relevantCount ?? 0,
    hasData: (totalIngested ?? 0) > 0,
  };
}
