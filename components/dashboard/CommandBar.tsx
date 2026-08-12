import { Activity, TrendingUp, TrendingDown, Minus, Timer } from "lucide-react";
import { Card } from "@/components/common/Card";
import { sentimentTone, formatBriefDate } from "@/lib/sentiment";
import { formatClockTime } from "@/lib/time";

const TONE_ICON = { bullish: TrendingUp, bearish: TrendingDown, neutral: Minus } as const;
const TONE_COLOR = {
  bullish: "var(--bullish)",
  bearish: "var(--bearish)",
  neutral: "var(--neutral)",
} as const;

export function CommandBar({
  briefDate,
  lastUpdated,
  sentiment,
  confidence,
  marketScore,
  sixtySecondBrief,
}: {
  briefDate: string | null;
  lastUpdated: string | null;
  sentiment: string | null;
  confidence: number | null;
  marketScore: number | null;
  sixtySecondBrief: string | null;
}) {
  const dateLabel = formatBriefDate(briefDate ?? new Date().toISOString().slice(0, 10));
  const hasSentiment = sentiment !== null && confidence !== null && marketScore !== null;
  const tone = hasSentiment ? sentimentTone(sentiment) : "neutral";
  const Icon = TONE_ICON[tone];
  const color = TONE_COLOR[tone];
  const scorePct = hasSentiment ? (marketScore! / 10) * 100 : 0;

  return (
    <Card id="top" className="scroll-mt-16 overflow-hidden p-0">
      <div className="flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Gold</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Daily Market Brief
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{dateLabel}</p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-text-secondary">
            <Activity size={12} aria-hidden="true" />
            Market Intelligence
          </span>
          {lastUpdated && (
            <span className="font-mono text-xs text-text-secondary">
              Last updated {formatClockTime(lastUpdated)} UTC
            </span>
          )}
        </div>
      </div>

      {hasSentiment ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
              >
                <Icon size={22} color={color} strokeWidth={2.25} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
                  {sentiment!.toUpperCase()}
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
                  {marketScore!.toFixed(1)}
                  <span className="text-sm text-text-secondary">/10</span>
                </span>
              </div>
              <div
                className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={10}
                aria-valuenow={marketScore!}
                aria-label="Gold market score out of 10"
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${scorePct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Timer size={14} className="text-gold" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                60-Second Gold Brief
              </p>
            </div>
            <p className="mt-2 text-base font-medium leading-relaxed text-text-primary sm:text-lg">
              {sixtySecondBrief ?? "Not yet generated."}
            </p>
          </div>
        </>
      ) : (
        <div className="border-t border-border p-5 text-sm text-text-secondary sm:p-6">
          No brief yet — sentiment and the 60-second brief appear here once today&apos;s aggregation has
          run.
        </div>
      )}
    </Card>
  );
}
