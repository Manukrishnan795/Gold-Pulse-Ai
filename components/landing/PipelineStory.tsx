import { Rss, Sparkles, Filter, ListOrdered, MessageCircleQuestion, Clock } from "lucide-react";
import type { PipelineStats } from "@/lib/stats";

export function PipelineStory({ stats }: { stats: PipelineStats }) {
  const steps = [
    {
      icon: Rss,
      label: "News Ingested",
      value: stats.hasData ? `${stats.totalIngested}` : "—",
      caption: "articles today",
    },
    {
      icon: Filter,
      label: "AI Analysis",
      value: null,
      caption: "relevance, duplicates, impact",
    },
    {
      icon: Sparkles,
      label: "Gold-Relevant",
      value: stats.hasData ? `${stats.relevantCount}` : "—",
      caption: "kept after filtering",
    },
    {
      icon: ListOrdered,
      label: "Top Developments",
      value: null,
      caption: "ranked by importance",
    },
    {
      icon: MessageCircleQuestion,
      label: "Why It Matters",
      value: null,
      caption: "plain-language reasoning",
    },
    {
      icon: Clock,
      label: "3-Minute Brief",
      value: null,
      caption: "one page, every morning",
    },
  ];

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">How It Works</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          From market noise to a 3-minute brief
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          GoldPulse doesn&apos;t just summarize headlines. It decides what&apos;s actually relevant
          to Gold, discards the rest, and explains why what&apos;s left matters.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex flex-col gap-3 bg-card p-4 sm:p-5">
              <Icon size={18} className="text-gold" aria-hidden="true" />
              <div>
                {step.value && (
                  <p className="font-mono text-xl font-semibold text-text-primary">{step.value}</p>
                )}
                <p className="mt-0.5 text-sm font-medium text-text-primary">{step.label}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{step.caption}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
