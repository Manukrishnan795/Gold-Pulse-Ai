import { Eye } from "lucide-react";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import type { WatchItem } from "@/lib/brief";

export function WatchList({ items }: { items: WatchItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Eye}
        title="No watch list yet"
        description="Today's must-watch items appear here once the daily aggregation has run."
      />
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2">
        <Eye size={18} className="text-gold" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-text-primary">Watch Today</h2>
      </div>
      <Card className="mt-3 divide-y divide-border p-0">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-start gap-3 p-4">
            <span className="font-mono text-sm text-text-secondary">{i + 1}</span>
            <div>
              <p className="text-sm font-medium text-text-primary">{item.label}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{item.reason}</p>
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
