import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { Card } from "@/components/common/Card";
import { MARKET_PULSE_DRIVERS, type DriverSnapshot } from "@/lib/drivers";
import type { GoldDriver } from "@/lib/types";

const DIRECTION_ICON = { bullish: ArrowUp, bearish: ArrowDown, neutral: ArrowRight } as const;
const DIRECTION_COLOR = {
  bullish: "var(--bullish)",
  bearish: "var(--bearish)",
  neutral: "var(--neutral)",
} as const;

const SHORT_LABEL: Record<GoldDriver, string> = {
  USD: "USD",
  Yields: "Yields",
  Fed: "Fed",
  Oil: "Oil",
  RiskSentiment: "Risk",
  Inflation: "Inflation",
  Employment: "Jobs",
  Geopolitics: "Geopolitics",
  CentralBanks: "Cent. Banks",
  ETFs: "ETFs",
  GlobalGrowth: "Growth",
};

export function MarketPulse({ snapshots }: { snapshots: Map<GoldDriver, DriverSnapshot> }) {
  return (
    <Card className="overflow-x-auto p-4">
      <div className="flex min-w-max items-center divide-x divide-border">
        <span className="pr-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">
          Market Pulse
        </span>
        {MARKET_PULSE_DRIVERS.map((driver) => {
          const snapshot = snapshots.get(driver);
          if (!snapshot) {
            return (
              <div key={driver} className="flex items-center gap-1.5 px-4 text-text-secondary">
                <span className="text-sm font-medium">{SHORT_LABEL[driver]}</span>
                <span className="text-sm">—</span>
              </div>
            );
          }
          const Icon = DIRECTION_ICON[snapshot.impact];
          const color = DIRECTION_COLOR[snapshot.impact];
          return (
            <div key={driver} className="flex items-center gap-1.5 px-4">
              <span className="text-sm font-medium text-text-primary">{SHORT_LABEL[driver]}</span>
              <Icon size={15} color={color} strokeWidth={2.5} aria-label={snapshot.impact} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
