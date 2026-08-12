import { Sparkles, AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { DRIVER_LABELS } from "@/lib/drivers";
import type { GoldDriver } from "@/lib/types";
import type { StoryView } from "@/lib/brief";

export function WhyItMatters({
  topStory,
  invalidationNote,
}: {
  topStory: StoryView | null;
  invalidationNote?: string | null;
}) {
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

      {invalidationNote && (
        <div className="mt-4 flex gap-2 border-t border-border pt-4">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-text-secondary" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-text-secondary">
            <span className="font-medium text-text-primary">What could change this view — </span>
            {invalidationNote}
          </p>
        </div>
      )}
    </section>
  );
}
