import { Moon } from "lucide-react";
import { Card } from "@/components/common/Card";
import { DRIVER_LABELS } from "@/lib/drivers";
import type { GoldDriver } from "@/lib/types";
import type { OvernightItem } from "@/lib/brief";

export function OvernightSummary({ items }: { items: OvernightItem[] }) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2">
        <Moon size={18} className="text-gold" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-text-primary">
          Overnight — {items.length} thing{items.length === 1 ? "" : "s"} changed
        </h2>
      </div>
      <Card className="mt-3 divide-y divide-border p-0">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-4">
            <span className="font-mono text-sm text-text-secondary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm text-text-primary">{item.headline}</p>
              <p className="mt-0.5 text-xs text-text-secondary">
                {DRIVER_LABELS[item.driver as GoldDriver] ?? item.driver}
              </p>
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
