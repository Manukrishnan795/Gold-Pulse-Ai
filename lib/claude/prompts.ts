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

Think of your output as answering a real trader's actual morning questions, in this order: What's the state of play? Why is Gold moving? What happened overnight? What should I watch? What would change this view?

Your job:
1. Cluster the input articles into 3-6 distinct market stories. Each story can have one or many member articles (reference them by their [N] index from the input list). Do not create a story with zero members, and do not leave a genuinely important article out of every story.
2. For each story, write a SYNTHESIZED headline and summary that represents the whole story — not just copied from one member article. Assign the story's overall impact (bullish/bearish/neutral), importance (high/medium/low), primary gold_driver, and a why_it_matters explanation that reflects the combined weight of all its sources.
3. Rank the stories by importance to a Gold trader today.
4. Identify the primary_driver and secondary_driver for Gold today — the two factors doing the most to move Gold right now, each with its own direction and a one-sentence note explaining the mechanism (e.g. "USD firmness ahead of CPI is capping Gold's upside"). Pick two distinct drivers even if one is clearly dominant.
5. Write a watch_list: 3-5 specific things a trader should monitor today (an event, a level, a driver), each with a short reason.
6. Write an invalidation_note: one or two sentences on what would flip today's sentiment (be specific — name the conditions, not just "if sentiment changes").
7. Write an overnight_summary: 2-4 short items, each a headline + the driver it relates to, covering what's new/changed compared to yesterday's brief. If no prior brief was provided (first day), return an empty array.
8. Assign an overall sentiment (one of: Bullish, Moderately Bullish, Neutral, Moderately Bearish, Bearish), a confidence 0-100, and a market_score 0.0-10.0 reflecting how favorable the environment is for Gold right now.
9. List distinct bullish_factors and bearish_factors (short clauses, no duplicated drivers).
10. Write a sixty_second_brief: ONE tight paragraph, 40-70 words, that alone could substitute for reading anything else — sentiment, the primary driver, and what to watch. This is NOT a shorter version of ai_summary; write it fresh, denser.
11. Write a 150-250 word ai_summary: what a Gold trader needs to know this morning — what happened, why it matters, current balance of forces, what to watch today.

This is a market-intelligence product, NOT financial advice. Never write trading instructions (buy/sell/enter/exit/guaranteed profit), and never predict where price will go. Use language like "supportive," "negative pressure," "factor to monitor," "potential volatility," "historically associated with."

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
      primary_driver: {
        type: "object",
        description: "The single biggest factor moving Gold today.",
        properties: {
          driver: { type: "string", enum: GOLD_DRIVERS as unknown as string[] },
          impact: { type: "string", enum: ["bullish", "bearish", "neutral"] },
          note: { type: "string", description: "One sentence explaining the mechanism." },
        },
        required: ["driver", "impact", "note"],
      },
      secondary_driver: {
        type: "object",
        description: "The second biggest factor moving Gold today — must be a different driver than primary_driver.",
        properties: {
          driver: { type: "string", enum: GOLD_DRIVERS as unknown as string[] },
          impact: { type: "string", enum: ["bullish", "bearish", "neutral"] },
          note: { type: "string", description: "One sentence explaining the mechanism." },
        },
        required: ["driver", "impact", "note"],
      },
      watch_list: {
        type: "array",
        description: "3-5 specific things a trader should monitor today.",
        items: {
          type: "object",
          properties: {
            label: { type: "string", description: "Short name of the event/level/driver to watch." },
            reason: { type: "string", description: "One short clause on why it matters." },
          },
          required: ["label", "reason"],
        },
      },
      invalidation_note: {
        type: "string",
        description: "1-2 sentences on the specific conditions that would flip today's sentiment.",
      },
      overnight_summary: {
        type: "array",
        description: "2-4 items covering what changed vs yesterday's brief. Empty array if no prior brief was provided.",
        items: {
          type: "object",
          properties: {
            headline: { type: "string" },
            driver: { type: "string", enum: GOLD_DRIVERS as unknown as string[] },
          },
          required: ["headline", "driver"],
        },
      },
      sentiment: {
        type: "string",
        enum: SENTIMENT_LEVELS as unknown as string[],
      },
      confidence: { type: "integer", minimum: 0, maximum: 100 },
      market_score: { type: "number", minimum: 0, maximum: 10 },
      sixty_second_brief: {
        type: "string",
        description: "40-70 words. A dense, standalone summary — not a trimmed ai_summary.",
      },
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
    },
    required: [
      "market_stories",
      "primary_driver",
      "secondary_driver",
      "watch_list",
      "invalidation_note",
      "overnight_summary",
      "sentiment",
      "confidence",
      "market_score",
      "sixty_second_brief",
      "ai_summary",
      "bullish_factors",
      "bearish_factors",
    ],
  },
};
