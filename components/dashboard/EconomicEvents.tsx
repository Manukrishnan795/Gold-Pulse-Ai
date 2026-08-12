import { CalendarClock } from "lucide-react";
import { Card } from "@/components/common/Card";
import { ImportanceBadge } from "@/components/common/Badge";
import type { EconomicEventView } from "@/lib/events";

const COLUMN_HEADERS = ["Time", "Event", "Importance", "Gold Relevance"];

export function EconomicEvents({ events }: { events: EconomicEventView[] }) {
  return (
    <section id="events" className="scroll-mt-16">
      <h2 className="text-lg font-semibold text-text-primary">Today&apos;s Economic Events</h2>
      <p className="mt-1 text-sm text-text-secondary">Only releases relevant to Gold.</p>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="grid grid-cols-[64px_1fr_auto] gap-3 border-b border-border px-4 py-2 sm:grid-cols-[64px_1fr_auto_auto]">
          {COLUMN_HEADERS.map((header, i) => (
            <span
              key={header}
              className={`text-[11px] font-semibold uppercase tracking-wider text-text-secondary ${
                i === 3 ? "hidden sm:block" : ""
              }`}
            >
              {header}
            </span>
          ))}
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <CalendarClock className="text-text-secondary" size={22} strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm font-medium text-text-primary">Economic calendar not connected yet</p>
            <p className="max-w-sm text-xs text-text-secondary">
              This fills in once the economic_events table is populated by a calendar data source
              (e.g. FRED release dates).
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {events.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-[64px_1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[64px_1fr_auto_auto]"
              >
                <span className="font-mono text-sm text-text-secondary">
                  {event.event_time ? event.event_time.slice(0, 5) : "—"}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{event.event_name}</p>
                  <p className="text-xs text-text-secondary">{event.country}</p>
                </div>
                <ImportanceBadge importance={event.importance} />
                <p className="hidden max-w-[220px] truncate text-xs text-text-secondary sm:block">
                  {event.expected_gold_relevance ?? "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}
