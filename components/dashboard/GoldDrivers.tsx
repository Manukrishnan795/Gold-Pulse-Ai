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

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_DRIVERS.map((driver) => {
          const snapshot = snapshots.get(driver);
          return (
            <Card key={driver} hover className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-text-primary">
                  {snapshot?.label ?? driver}
                </p>
                {snapshot && <ImpactBadge impact={snapshot.impact} />}
              </div>
              {snapshot ? (
                <>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    {snapshot.explanation}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-text-secondary">
                    {snapshot.articleCount} development{snapshot.articleCount === 1 ? "" : "s"} today
                  </p>
                </>
              ) : (
                <p className="mt-2 text-xs text-text-secondary">No developments flagged today.</p>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
