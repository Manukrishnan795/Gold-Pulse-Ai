import { Activity } from "lucide-react";
import { formatBriefDate } from "@/lib/sentiment";
import { formatClockTime } from "@/lib/time";

export function GoldHeader({
  briefDate,
  lastUpdated,
}: {
  briefDate: string | null;
  lastUpdated: string | null;
}) {
  const dateLabel = briefDate ? formatBriefDate(briefDate) : formatBriefDate(new Date().toISOString().slice(0, 10));

  return (
    <div id="top" className="scroll-mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Gold</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-text-primary">
            Daily Market Brief
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{dateLabel}</p>
        </div>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-text-secondary">
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
    </div>
  );
}
