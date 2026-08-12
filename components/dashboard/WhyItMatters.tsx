import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { DRIVER_LABELS } from "@/lib/drivers";
import type { GoldDriver } from "@/lib/types";
import type { StoryView } from "@/lib/brief";

export function WhyItMatters({ topStory }: { topStory: StoryView | null }) {
  if (!topStory) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No analysis yet"
        description="The lead rationale appears here once today's top story has been ranked."
      />
    );
  }

  const driverLabel = DRIVER_LABELS[topStory.gold_driver as GoldDriver] ?? topStory.gold_driver;

  return (
    <section
      className="rounded-lg border-l-2 bg-surface p-5 sm:p-6"
      style={{ borderLeftColor: "var(--gold)" }}
    >
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-gold" aria-hidden="true" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
          Why It Matters
        </h2>
      </div>
      <p className="mt-3 text-lg font-medium leading-snug text-text-primary sm:text-xl">
        {topStory.why_it_matters}
      </p>
      <p className="mt-3 text-xs text-text-secondary">
        Primary driver today: <span className="text-text-primary">{driverLabel}</span> — from{" "}
        <span className="text-text-primary">{topStory.headline}</span> ({topStory.source_count} source
        {topStory.source_count === 1 ? "" : "s"})
      </p>
    </section>
  );
}
