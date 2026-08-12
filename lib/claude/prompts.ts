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
