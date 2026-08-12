import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import type { DevelopmentView } from "@/lib/brief";

export function TopDevelopments({ developments }: { developments: DevelopmentView[] }) {
  if (developments.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold">Top Gold Developments</h2>
        <p className="mt-2 text-sm text-zinc-500">No developments ranked yet.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-semibold">Top Gold Developments</h2>
      <div className="mt-3 space-y-3">
        {developments.map((dev) => (
          <Card key={dev.rank}>
            <div className="flex items-start justify-between gap-3">
              <a
                href={dev.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {dev.rank}. {dev.title}
              </a>
              <div className="flex shrink-0 gap-1.5">
                <Badge tone={dev.impact}>{dev.impact}</Badge>
                <Badge tone={dev.importance}>{dev.importance}</Badge>
              </div>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {dev.source} · {dev.gold_driver}
            </p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{dev.summary}</p>
            <p className="mt-1 text-sm text-zinc-500">
              <span className="font-medium">Why it matters: </span>
              {dev.why_it_matters}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
