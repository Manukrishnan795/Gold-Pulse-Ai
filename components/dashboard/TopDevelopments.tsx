import { Zap, ExternalLink } from "lucide-react";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ImpactBadge } from "@/components/common/Badge";
import { formatRelativeTime } from "@/lib/time";
import type { DevelopmentView } from "@/lib/brief";

const ACCENT_COLOR = {
  bullish: "var(--bullish)",
  bearish: "var(--bearish)",
  neutral: "var(--neutral)",
} as const;

export function TopDevelopments({ developments }: { developments: DevelopmentView[] }) {
  const top = developments.slice(0, 5);

  return (
    <section id="brief" className="scroll-mt-16">
      <div className="flex items-center gap-2">
        <Zap size={18} className="text-gold" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-text-primary">5 Things You Need to Know</h2>
      </div>

      {top.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No ranked developments yet"
          description="This section fills in once the daily aggregation pipeline has selected today's top developments."
        />
      ) : (
        <div className="mt-4 space-y-2">
          {top.map((dev) => (
            <Card
              key={dev.rank}
              hover
              className="border-l-2 p-4 sm:p-5"
              style={{ borderLeftColor: ACCENT_COLOR[dev.impact] }}
            >
              <div className="flex gap-4">
                <span className="font-mono text-xl font-semibold text-border sm:text-2xl">
                  {String(dev.rank).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <a
                      href={dev.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-start gap-1 text-sm font-medium text-text-primary hover:underline"
                    >
                      {dev.title}
                      <ExternalLink
                        size={12}
                        className="mt-1 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </a>
                  </div>

                  <p className="mt-1 text-xs text-text-secondary">
                    {dev.source} · {formatRelativeTime(dev.published_at)}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <ImpactBadge impact={dev.impact} />
                    <span className="font-mono text-xs text-text-secondary">
                      Gold relevance: {dev.relevance_score}%
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{dev.summary}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-primary">
                    <span className="font-medium text-gold-highlight">Why it matters — </span>
                    {dev.why_it_matters}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
