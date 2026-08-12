import { createPublicClient } from "./supabase/client";

export interface EconomicEventView {
  id: string;
  event_name: string;
  country: string;
  event_date: string;
  event_time: string | null;
  importance: "high" | "medium" | "low";
  expected_gold_relevance: string | null;
}

export async function getUpcomingEvents(): Promise<EconomicEventView[]> {
  const supabase = createPublicClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("economic_events")
    .select("id, event_name, country, event_date, event_time, importance, expected_gold_relevance")
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true })
    .limit(10);

  if (error) throw error;
  return data ?? [];
}
