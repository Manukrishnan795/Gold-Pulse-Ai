import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sentimentTone, formatBriefDate } from "@/lib/sentiment";
import type { BriefView } from "@/lib/brief";

function LivePreviewCard({ brief }: { brief: BriefView | null }) {
  if (!brief) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-text-secondary">
          Today&apos;s brief is being generated. Check back shortly.
        </p>
      </div>
    );
  }

  const tone = sentimentTone(brief.sentiment);
  const toneColor =
    tone === "bullish" ? "var(--bullish)" : tone === "bearish" ? "var(--bearish)" : "var(--neutral)";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ backgroundColor: "var(--bullish)" }}
            />
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--bullish)" }}
            />
          </span>
          LIVE
        </span>
        <span className="text-xs text-text-secondary">{formatBriefDate(brief.brief_date)}</span>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">
        Gold Market Sentiment
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: toneColor }}>
        {brief.sentiment}
      </p>

      <div className="mt-4 flex items-center gap-6">
        <div>
          <p className="text-[11px] text-text-secondary">Market Score</p>
          <p className="font-mono text-lg font-semibold text-text-primary">
            {brief.market_score.toFixed(1)}
            <span className="text-text-secondary">/10</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] text-text-secondary">Confidence</p>
          <p className="font-mono text-lg font-semibold text-text-primary">{brief.confidence}%</p>
        </div>
        <div>
          <p className="text-[11px] text-text-secondary">Market Stories</p>
          <p className="font-mono text-lg font-semibold text-text-primary">{brief.stories.length}</p>
        </div>
      </div>
    </div>
  );
}

export function Hero({ brief }: { brief: BriefView | null }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
        <div>
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-text-secondary">
            AI-Powered Gold Market Intelligence
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-[3.25rem]">
            Know what moved Gold <span className="text-gold">before you trade.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary">
            GoldPulse reads the overnight news, filters out the noise, and explains exactly what
            matters for Gold today — sentiment, drivers, and risks, in one briefing you can read
            in under 5 minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-background transition-colors duration-150 hover:bg-gold-highlight"
            >
              Open Today&apos;s Brief
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <span className="text-xs text-text-secondary">Free · No account needed</span>
          </div>
        </div>

        <LivePreviewCard brief={brief} />
      </div>
    </section>
  );
}
