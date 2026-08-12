import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { DRIVER_LABELS } from "@/lib/drivers";
import type { GoldDriver } from "@/lib/types";
import type { DevelopmentView } from "@/lib/brief";

export function WhyItMatters({ topDevelopment }: { topDevelopment: DevelopmentView | null }) {
  if (!topDevelopment) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No analysis yet"
        description="The lead rationale appears here once today's top development has been ranked."
      />
    );
  }

  const driverLabel = DRIVER_LABELS[topDevelopment.gold_driver as GoldDriver] ?? topDevelopment.gold_driver;

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
        {topDevelopment.why_it_matters}
      </p>
      <p className="mt-3 text-xs text-text-secondary">
        Primary driver today: <span className="text-text-primary">{driverLabel}</span> — from{" "}
        <span className="text-text-primary">{topDevelopment.title}</span>
      </p>
    </section>
  );
}
