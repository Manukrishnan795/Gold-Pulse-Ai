import { CalendarClock } from "lucide-react";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { ImportanceBadge } from "@/components/common/Badge";
import type { EconomicEventView } from "@/lib/events";

export function EconomicEvents({ events }: { events: EconomicEventView[] }) {
  return (
    <section id="events" className="scroll-mt-16">
      <h2 className="text-lg font-semibold text-text-primary">Today&apos;s Economic Events</h2>

      {events.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={CalendarClock}
            title="Economic calendar not connected yet"
            description="This section will show scheduled high-impact releases (CPI, Fed speeches, NFP) once the economic_events table is populated by a calendar data source."
          />
        </div>
      ) : (
        <Card className="mt-4 divide-y divide-border p-0">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-4 p-4">
              <span className="w-14 shrink-0 font-mono text-sm text-text-secondary">
                {event.event_time ? event.event_time.slice(0, 5) : "—"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">{event.event_name}</p>
                  <ImportanceBadge importance={event.importance} />
                </div>
                <p className="mt-0.5 text-xs text-text-secondary">{event.country}</p>
                {event.expected_gold_relevance && (
                  <p className="mt-1 text-xs text-text-secondary">{event.expected_gold_relevance}</p>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </section>
  );
}
