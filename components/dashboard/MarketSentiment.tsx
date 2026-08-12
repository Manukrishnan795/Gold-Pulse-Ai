import { TrendingUp, TrendingDown, Minus, Gauge } from "lucide-react";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { sentimentTone } from "@/lib/sentiment";

const TONE_ICON = { bullish: TrendingUp, bearish: TrendingDown, neutral: Minus } as const;
const TONE_COLOR = {
  bullish: "var(--bullish)",
  bearish: "var(--bearish)",
  neutral: "var(--neutral)",
} as const;

export function MarketSentiment({
  sentiment,
  confidence,
  marketScore,
}: {
  sentiment: string | null;
  confidence: number | null;
  marketScore: number | null;
}) {
  if (sentiment === null || confidence === null || marketScore === null) {
    return (
      <EmptyState
        icon={Gauge}
        title="No sentiment score yet"
        description="Sentiment appears here once the daily aggregation pipeline has run for today (requires POST /api/cron/generate-brief)."
      />
    );
  }

  const tone = sentimentTone(sentiment);
  const Icon = TONE_ICON[tone];
  const color = TONE_COLOR[tone];
  const scorePct = (marketScore / 10) * 100;

  return (
    <Card className="p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
        Gold Market Sentiment
      </p>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
          >
            <Icon size={22} color={color} strokeWidth={2.25} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
              {sentiment.toUpperCase()}
            </p>
            <p className="mt-0.5 text-xs text-text-secondary">
              Confidence: <span className="font-mono text-text-primary">{confidence}%</span>
            </p>
          </div>
        </div>

        <div className="min-w-[160px] flex-1 sm:flex-none">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-text-secondary">Market Score</span>
            <span className="font-mono text-lg font-semibold text-text-primary">
              {marketScore.toFixed(1)}<span className="text-sm text-text-secondary">/10</span>
            </span>
          </div>
          <div
            className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={10}
            aria-valuenow={marketScore}
            aria-label="Gold market score out of 10"
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${scorePct}%`, backgroundColor: color }}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-text-secondary">
        Based on current macroeconomic and market developments.
      </p>
    </Card>
  );
}
