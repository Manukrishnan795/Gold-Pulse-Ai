import { createServerClient } from "../supabase/server";

interface FredReleaseConfig {
  releaseId: number;
  eventName: string;
  importance: "high" | "medium" | "low";
  expectedGoldRelevance: string;
  // Typical release time in UTC (EDT basis — FRED doesn't provide time-of-day).
  eventTimeUtc: string;
}

// Curated, verified against the real FRED API (release_id via GET /fred/releases,
// then spot-checked with GET /fred/release/dates?release_id=N to confirm it
// returns discrete scheduled dates, not a continuously-updating daily series).
const TRACKED_RELEASES: FredReleaseConfig[] = [
  {
    releaseId: 10,
    eventName: "US CPI (Consumer Price Index)",
    importance: "high",
    expectedGoldRelevance:
      "Inflation surprises reset Fed rate expectations and real yields — historically one of the highest-volatility events for Gold.",
    eventTimeUtc: "12:30:00",
  },
  {
    releaseId: 50,
    eventName: "US Employment Situation (Non-Farm Payrolls)",
    importance: "high",
    expectedGoldRelevance:
      "Labor market strength/weakness shapes Fed policy expectations; a big surprise historically moves USD and Gold sharply.",
    eventTimeUtc: "12:30:00",
  },
  {
    releaseId: 46,
    eventName: "US PPI (Producer Price Index)",
    importance: "medium",
    expectedGoldRelevance:
      "Upstream inflation gauge; less market-moving than CPI but still feeds into Fed rate expectations.",
    eventTimeUtc: "12:30:00",
  },
  {
    releaseId: 180,
    eventName: "US Initial Jobless Claims",
    importance: "medium",
    expectedGoldRelevance:
      "Weekly labor market pulse; a run of surprises can shift Fed expectations even though any single week rarely moves Gold much.",
    eventTimeUtc: "12:30:00",
  },
];

// FRED's "FOMC Press Release" release (id 101) turned out to track a
// continuously-updating daily rate series, not discrete meeting dates — it
// would have shown "FOMC Press Release" on nearly every calendar day, which
// is wrong. FOMC only meets 8x/year on dates the Fed publishes well in
// advance, so those are sourced directly from the Fed's own calendar
// instead: https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
// (fetched live, not from training memory). Second day of each two-day
// meeting is listed — that's the day the policy statement is announced.
// Needs a manual refresh once the Fed publishes next year's calendar.
const FOMC_MEETING_DATES_2026 = [
  "2026-01-28",
  "2026-03-18",
  "2026-04-29",
  "2026-06-17",
  "2026-07-29",
  "2026-09-16",
  "2026-10-28",
  "2026-12-09",
];

const FOMC_EVENT_NAME = "FOMC Policy Decision";
const FOMC_GOLD_RELEVANCE =
  "Direct Fed policy communication — rate decisions and forward guidance are historically among the largest Gold-moving events.";
const FOMC_TIME_UTC = "18:00:00";

const LOOKAHEAD_DAYS = 14;
// FOMC meets roughly every 6 weeks — a 14-day window would often show none,
// so it gets its own wider lookahead to reliably surface the next meeting.
const FOMC_LOOKAHEAD_DAYS = 60;

interface FredReleaseDatesResponse {
  release_dates: { release_id: number; date: string }[];
}

async function fetchUpcomingDates(releaseId: number, apiKey: string): Promise<string[]> {
  const today = new Date().toISOString().slice(0, 10);
  const url = new URL("https://api.stlouisfed.org/fred/release/dates");
  url.searchParams.set("release_id", String(releaseId));
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("realtime_start", today);
  url.searchParams.set("sort_order", "asc");
  url.searchParams.set("limit", "5");
  url.searchParams.set("include_release_dates_with_no_data", "true");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`FRED release/dates failed for release_id=${releaseId}: ${res.status}`);
  const data = (await res.json()) as FredReleaseDatesResponse;
  return data.release_dates.map((d) => d.date);
}

function dateOffset(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface CalendarResult {
  fetched: number;
  inserted: number;
  errors: { releaseId: number; message: string }[];
}

interface EventRow {
  event_name: string;
  country: string;
  event_date: string;
  event_time: string;
  importance: "high" | "medium" | "low";
  expected_gold_relevance: string;
  source: string;
}

export async function runCalendarIngestion(): Promise<CalendarResult> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) throw new Error("Missing FRED_API_KEY");

  const supabase = createServerClient();
  const today = dateOffset(0);
  const cutoffStr = dateOffset(LOOKAHEAD_DAYS);
  const fomcCutoffStr = dateOffset(FOMC_LOOKAHEAD_DAYS);

  const result: CalendarResult = { fetched: 0, inserted: 0, errors: [] };
  const rows: EventRow[] = [];

  for (const release of TRACKED_RELEASES) {
    try {
      const dates = await fetchUpcomingDates(release.releaseId, apiKey);
      const withinWindow = dates.filter((d) => d >= today && d <= cutoffStr);
      result.fetched += withinWindow.length;

      for (const date of withinWindow) {
        rows.push({
          event_name: release.eventName,
          country: "US",
          event_date: date,
          event_time: release.eventTimeUtc,
          importance: release.importance,
          expected_gold_relevance: release.expectedGoldRelevance,
          source: "FRED",
        });
      }
    } catch (err) {
      result.errors.push({
        releaseId: release.releaseId,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const upcomingFomc = FOMC_MEETING_DATES_2026.filter((d) => d >= today && d <= fomcCutoffStr);
  result.fetched += upcomingFomc.length;
  for (const date of upcomingFomc) {
    rows.push({
      event_name: FOMC_EVENT_NAME,
      country: "US",
      event_date: date,
      event_time: FOMC_TIME_UTC,
      importance: "high",
      expected_gold_relevance: FOMC_GOLD_RELEVANCE,
      source: "Federal Reserve",
    });
  }

  // Idempotent: clear the widest window we just fetched, then reinsert.
  const widestCutoff = fomcCutoffStr > cutoffStr ? fomcCutoffStr : cutoffStr;
  await supabase.from("economic_events").delete().gte("event_date", today).lte("event_date", widestCutoff);

  if (rows.length > 0) {
    const { error } = await supabase.from("economic_events").insert(rows);
    if (error) throw error;
    result.inserted = rows.length;
  }

  return result;
}
