export interface NewsSource {
  name: string;
  url: string;
}

// Confirmed-working public RSS feeds. Add more here once verified —
// don't guess at feed URLs, test them first (curl the URL, check it's real XML).
export const RSS_SOURCES: NewsSource[] = [
  { name: "Federal Reserve", url: "https://www.federalreserve.gov/feeds/press_all.xml" },
  { name: "FXStreet", url: "https://www.fxstreet.com/rss/news" },
];

// Coarse keyword pre-filter so we don't burn Claude calls on articles that
// have nothing to do with Gold. This is intentionally generous — Claude
// makes the real relevance call in the analysis step; this just cuts obvious
// noise (sports, unrelated corporate news, etc.) before it reaches the API.
export const RELEVANCE_KEYWORDS = [
  "gold",
  "xau",
  "bullion",
  "precious metal",
  "fed",
  "federal reserve",
  "fomc",
  "powell",
  "interest rate",
  "rate cut",
  "rate hike",
  "treasury yield",
  "10-year",
  "dollar",
  "usd",
  "dxy",
  "inflation",
  "cpi",
  "pce",
  "jobs report",
  "payroll",
  "unemployment",
  "geopolit",
  "sanctions",
  "war",
  "conflict",
  "central bank",
  "opec",
  "crude oil",
  "recession",
  "gdp",
  "safe haven",
  "risk sentiment",
  "etf",
];

export function isLikelyGoldRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  return RELEVANCE_KEYWORDS.some((kw) => lower.includes(kw));
}
