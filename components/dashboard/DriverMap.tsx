import { Card } from "@/components/common/Card";
import { ImpactBadge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { Compass } from "lucide-react";
import { DRIVER_LABELS } from "@/lib/drivers";
import type { GoldDriver } from "@/lib/types";
import type { DriverCallout } from "@/lib/brief";

function DriverCard({ label, callout }: { label: string; callout: DriverCallout }) {
  const driverLabel = DRIVER_LABELS[callout.driver as GoldDriver] ?? callout.driver;
  return (
    <Card className="p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">{label}</p>
      <div className="mt-1.5 flex items-center gap-2">
        <p className="text-base font-semibold text-text-primary">{driverLabel}</p>
        <ImpactBadge impact={callout.impact} />
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{callout.note}</p>
    </Card>
  );
}

export function DriverMap({
  primary,
  secondary,
}: {
  primary: DriverCallout | null;
  secondary: DriverCallout | null;
}) {
  if (!primary || !secondary) {
    return (
      <EmptyState
        icon={Compass}
        title="No driver analysis yet"
        description="Why Gold is moving today appears here once the daily aggregation has run."
      />
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2">
        <Compass size={18} className="text-gold" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-text-primary">Why Gold Is Moving</h2>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <DriverCard label="Primary Driver" callout={primary} />
        <DriverCard label="Secondary Driver" callout={secondary} />
      </div>
    </section>
  );
}
