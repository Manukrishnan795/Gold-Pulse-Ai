import { Zap, ExternalLink, Newspaper } from "lucide-react";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ImpactBadge } from "@/components/common/Badge";
import { formatRelativeTime } from "@/lib/time";
import type { StoryView } from "@/lib/brief";

const ACCENT_COLOR = {
  bullish: "var(--bullish)",
  bearish: "var(--bearish)",
  neutral: "var(--neutral)",
} as const;

export function TopDevelopments({ stories }: { stories: StoryView[] }) {
  const top = stories.slice(0, 5);

  return (
    <section id="brief" className="scroll-mt-16">
      <div className="flex items-center gap-2">
        <Zap size={18} className="text-gold" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-text-primary">
          {top.length} Thing{top.length === 1 ? "" : "s"} You Need to Know
        </h2>
      </div>

      {top.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No ranked stories yet"
          description="This section fills in once the daily aggregation pipeline has clustered today's articles into market stories."
        />
      ) : (
        <div className="mt-4 space-y-2">
          {top.map((story) => {
            const mostRecent = story.sources[0];
            return (
              <Card
                key={story.rank}
                className="border-l-2 p-4 sm:p-5"
                style={{ borderLeftColor: ACCENT_COLOR[story.impact] }}
              >
                <div className="flex gap-4">
                  <span className="font-mono text-xl font-semibold text-border sm:text-2xl">
                    {String(story.rank).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{story.headline}</p>

                    {mostRecent && (
                      <p className="mt-1 text-xs text-text-secondary">
                        {mostRecent.source} · {formatRelativeTime(mostRecent.published_at)}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <ImpactBadge impact={story.impact} />
                      <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs font-medium text-text-secondary">
                        <Newspaper size={11} aria-hidden="true" />
                        {story.source_count} source{story.source_count === 1 ? "" : "s"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{story.summary}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-primary">
                      <span className="font-medium text-gold-highlight">Why it matters — </span>
                      {story.why_it_matters}
                    </p>

                    {story.sources.length > 0 && (
                      <details className="mt-2.5 group">
                        <summary className="cursor-pointer text-xs font-medium text-text-secondary hover:text-text-primary">
                          View {story.sources.length} source{story.sources.length === 1 ? "" : "s"}
                        </summary>
                        <ul className="mt-2 space-y-1.5 border-l border-border pl-3">
                          {story.sources.map((src) => (
                            <li key={src.source_url}>
                              <a
                                href={src.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link inline-flex items-start gap-1 text-xs text-text-secondary hover:text-text-primary hover:underline"
                              >
                                {src.title}
                                <ExternalLink
                                  size={10}
                                  className="mt-0.5 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100"
                                  aria-hidden="true"
                                />
                              </a>
                              <span className="ml-1 text-[11px] text-text-secondary">
                                — {src.source} · {formatRelativeTime(src.published_at)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
