import { createPublicClient } from "./supabase/client";
import type { GoldDriver, Impact, Importance } from "./types";

export const DRIVER_LABELS: Record<GoldDriver, string> = {
  USD: "US Dollar",
  Fed: "Federal Reserve",
  Yields: "Treasury Yields",
  Inflation: "Inflation",
  Employment: "Employment",
  Geopolitics: "Geopolitics",
  CentralBanks: "Central Banks",
  ETFs: "Gold ETFs",
  Oil: "Crude Oil",
  GlobalGrowth: "Global Growth",
  RiskSentiment: "Risk Sentiment",
};

export const ALL_DRIVERS: GoldDriver[] = [
  "USD",
  "Fed",
  "Yields",
  "Inflation",
  "Employment",
  "Geopolitics",
  "CentralBanks",
  "ETFs",
  "Oil",
  "GlobalGrowth",
  "RiskSentiment",
];

export const MARKET_PULSE_DRIVERS: GoldDriver[] = ["USD", "Yields", "Fed", "Oil", "RiskSentiment"];

export interface DriverSnapshot {
  driver: GoldDriver;
  label: string;
  impact: Impact;
  importance: Importance;
  explanation: string;
  articleCount: number;
}

function importanceRank(importance: Importance): number {
  return importance === "high" ? 2 : importance === "medium" ? 1 : 0;
}

interface DriverRow {
  gold_driver: string;
  impact: string;
  importance: string;
  relevance_score: number;
  why_it_matters: string;
}

export async function getDriverSnapshots(): Promise<Map<GoldDriver, DriverSnapshot>> {
  const supabase = createPublicClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("article_analysis")
    .select("gold_driver, impact, importance, relevance_score, why_it_matters")
    .eq("is_relevant", true)
    .gte("analyzed_at", `${today}T00:00:00Z`);

  if (error) throw error;

  const rowsByDriver = new Map<GoldDriver, DriverRow[]>();
  for (const row of (data ?? []) as DriverRow[]) {
    const driver = row.gold_driver as GoldDriver;
    const list = rowsByDriver.get(driver) ?? [];
    list.push(row);
    rowsByDriver.set(driver, list);
  }

  const snapshots = new Map<GoldDriver, DriverSnapshot>();
  for (const [driver, rows] of rowsByDriver) {
    const representative = rows.reduce((best, row) => {
      const rank = importanceRank(row.importance as Importance);
      const bestRank = importanceRank(best.importance as Importance);
      if (rank > bestRank) return row;
      if (rank === bestRank && row.relevance_score > best.relevance_score) return row;
      return best;
    });

    snapshots.set(driver, {
      driver,
      label: DRIVER_LABELS[driver],
      impact: representative.impact as Impact,
      importance: representative.importance as Importance,
      explanation: representative.why_it_matters,
      articleCount: rows.length,
    });
  }

  return snapshots;
}
