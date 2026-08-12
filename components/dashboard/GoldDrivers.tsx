import { Card } from "@/components/common/Card";
import { ImpactBadge } from "@/components/common/Badge";
import { ALL_DRIVERS, type DriverSnapshot } from "@/lib/drivers";
import type { GoldDriver } from "@/lib/types";

export function GoldDrivers({ snapshots }: { snapshots: Map<GoldDriver, DriverSnapshot> }) {
  return (
    <section id="drivers" className="scroll-mt-16">
      <h2 className="text-lg font-semibold text-text-primary">Gold Drivers</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Today&apos;s state of the macro factors that move Gold.
      </p>

      <Card className="mt-4 divide-y divide-border p-0">
        {ALL_DRIVERS.map((driver) => {
          const snapshot = snapshots.get(driver);
          return (
            <div
              key={driver}
              className="grid grid-cols-[minmax(96px,auto)_auto_1fr_auto] items-center gap-3 px-4 py-3 sm:gap-4"
            >
              <p className="truncate text-sm font-medium text-text-primary">
                {snapshot?.label ?? driver}
              </p>
              {snapshot ? (
                <ImpactBadge impact={snapshot.impact} />
              ) : (
                <span className="text-xs text-text-secondary">—</span>
              )}
              <p className="hidden truncate text-xs text-text-secondary sm:block">
                {snapshot?.explanation ?? "No developments flagged today."}
              </p>
              <span className="font-mono text-[11px] text-text-secondary">
                {snapshot ? snapshot.articleCount : 0}
              </span>
            </div>
          );
        })}
      </Card>
    </section>
  );
}
