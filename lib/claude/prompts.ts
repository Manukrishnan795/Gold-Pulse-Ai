import type Anthropic from "@anthropic-ai/sdk";

export const GOLD_DRIVERS = [
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
] as const;

export const ARTICLE_ANALYSIS_SYSTEM_PROMPT = `You are a Gold market analyst for GoldPulse AI, a market-intelligence product for retail Gold traders.

You will be given one news article. Decide whether it is genuinely relevant to Gold prices and, if so, how it affects Gold.

Rules:
- Be strict about relevance. Most general market/forex news is NOT meaningfully about Gold — only mark is_relevant true if there is a plausible causal link via USD strength, interest rates, Treasury yields, inflation, employment data, geopolitical risk, central bank behavior, ETF flows, oil, global growth, or broad risk sentiment.
- impact describes the effect ON GOLD specifically, not on the underlying asset the article is about.
- This is a market-intelligence product, NOT financial advice. Never write trading instructions (buy/sell/enter/exit/guaranteed). Use language like "supportive," "negative pressure," "factor to monitor."
- Be concise and concrete in summary and why_it_matters — a busy trader is reading this in seconds.

Always respond by calling the submit_gold_analysis tool exactly once.`;

export const ARTICLE_ANALYSIS_TOOL: Anthropic.Tool = {
  name: "submit_gold_analysis",
  description: "Submit the structured Gold-relevance analysis for one article.",
  input_schema: {
    type: "object",
    properties: {
      is_relevant: {
        type: "boolean",
        description: "True only if this article has a plausible causal link to Gold price movement.",
      },
      relevance_score: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        description: "0 = irrelevant to Gold, 100 = directly and immediately Gold-moving.",
      },
      gold_driver: {
        type: "string",
        enum: GOLD_DRIVERS as unknown as string[],
        description: "The single primary Gold driver this article affects.",
      },
      impact: {
        type: "string",
        enum: ["bullish", "bearish", "neutral"],
        description: "Effect on Gold price, not on the subject of the article.",
      },
      importance: {
        type: "string",
        enum: ["high", "medium", "low"],
      },
      summary: {
        type: "string",
        description: "1-2 sentence neutral summary of what happened.",
      },
      why_it_matters: {
        type: "string",
        description: "1-2 sentences, plain language, explaining the Gold-relevant implication.",
      },
      volatility_risk: {
        type: "boolean",
        description: "True if this could cause a sharp Gold price move today.",
      },
    },
    required: [
      "is_relevant",
      "relevance_score",
      "gold_driver",
      "impact",
      "importance",
      "summary",
      "why_it_matters",
      "volatility_risk",
    ],
  },
};

export const SENTIMENT_LEVELS = [
  "Bullish",
  "Moderately Bullish",
  "Neutral",
  "Moderately Bearish",
  "Bearish",
] as const;

export const DAILY_BRIEF_SYSTEM_PROMPT = `You are the lead Gold market analyst for GoldPulse AI. You will be given a list of today's Gold-relevant news developments (each already scored for impact/importance/driver) and, if available, yesterday's daily brief.

A CRITICAL first step: many of these articles describe the SAME underlying event or story from different angles (e.g. five articles about USD strength ahead of a CPI release, or three articles about the same Fed speaker comment, are ONE story, not five or three). Before ranking anything, group the articles into distinct market stories. Two articles belong in the same story if a Gold trader would say "yeah, that's the same thing" when told about both.

Your job:
1. Cluster the input articles into 3-6 distinct market stories. Each story can have one or many member articles (reference them by their [N] index from the input list). Do not create a story with zero members, and do not leave a genuinely important article out of every story.
2. For each story, write a SYNTHESIZED headline and summary that represents the whole story — not just copied from one member article. Assign the story's overall impact (bullish/bearish/neutral), importance (high/medium/low), primary gold_driver, and a why_it_matters explanation that reflects the combined weight of all its sources.
3. Rank the stories by importance to a Gold trader today.
4. Assign an overall sentiment (one of: Bullish, Moderately Bullish, Neutral, Moderately Bearish, Bearish), a confidence 0-100, and a market_score 0.0-10.0 reflecting how favorable the environment is for Gold right now.
5. List distinct bullish_factors and bearish_factors (short clauses, no duplicated drivers).
6. Write a 150-250 word ai_summary: what a Gold trader needs to know this morning — what happened, why it matters, current balance of forces, what to watch today.
7. If yesterday's brief is provided, write a short what_changed paragraph comparing today's sentiment/drivers to yesterday's. If no prior brief is provided, set what_changed to null.

This is a market-intelligence product, NOT financial advice. Never write trading instructions (buy/sell/enter/exit/guaranteed profit). Use language like "supportive," "negative pressure," "factor to monitor," "potential volatility."

Always respond by calling the submit_daily_brief tool exactly once.`;

export const DAILY_BRIEF_TOOL: Anthropic.Tool = {
  name: "submit_daily_brief",
  description: "Submit the finished Gold daily briefing, with articles clustered into distinct market stories.",
  input_schema: {
    type: "object",
    properties: {
      market_stories: {
        type: "array",
        description: "FILL THIS IN FIRST. 3-6 distinct market stories, ranked by importance. Every input article should belong to exactly one story.",
        items: {
          type: "object",
          properties: {
            rank: { type: "integer" },
            headline: {
              type: "string",
              description: "Synthesized headline representing the whole story, not copied from one article.",
            },
            member_article_indices: {
              type: "array",
              items: { type: "integer" },
              description: "The [N] indices from the input list of every article that belongs to this story.",
            },
            gold_driver: {
              type: "string",
              enum: GOLD_DRIVERS as unknown as string[],
            },
            impact: { type: "string", enum: ["bullish", "bearish", "neutral"] },
            importance: { type: "string", enum: ["high", "medium", "low"] },
            summary: {
              type: "string",
              description: "1-3 sentence synthesis of the story across all its member articles.",
            },
            why_it_matters: {
              type: "string",
              description: "Plain-language explanation of the combined significance of this story for Gold.",
            },
          },
          required: [
            "rank",
            "headline",
            "member_article_indices",
            "gold_driver",
            "impact",
            "importance",
            "summary",
            "why_it_matters",
          ],
        },
      },
      sentiment: {
        type: "string",
        enum: SENTIMENT_LEVELS as unknown as string[],
      },
      confidence: { type: "integer", minimum: 0, maximum: 100 },
      market_score: { type: "number", minimum: 0, maximum: 10 },
      ai_summary: {
        type: "string",
        description: "150-250 word morning briefing.",
      },
      bullish_factors: {
        type: "array",
        items: { type: "string" },
      },
      bearish_factors: {
        type: "array",
        items: { type: "string" },
      },
      what_changed: {
        type: ["string", "null"],
        description: "Comparison to yesterday's brief, or null if no prior brief was provided.",
      },
    },
    required: [
      "market_stories",
      "sentiment",
      "confidence",
      "market_score",
      "ai_summary",
      "bullish_factors",
      "bearish_factors",
      "what_changed",
    ],
  },
};
