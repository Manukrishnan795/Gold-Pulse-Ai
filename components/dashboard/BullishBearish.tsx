import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/common/Card";

export function BullishBearish({ bullish, bearish }: { bullish: string[]; bearish: string[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Card className="p-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} style={{ color: "var(--bullish)" }} aria-hidden="true" />
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--bullish)" }}>
            Bullish Factors
          </h3>
        </div>
        <ul className="mt-3 space-y-2.5">
          {bullish.length === 0 && <li className="text-sm text-text-secondary">None identified today.</li>}
          {bullish.map((factor, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-text-primary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "var(--bullish)" }} />
              {factor}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2">
          <TrendingDown size={16} style={{ color: "var(--bearish)" }} aria-hidden="true" />
          <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--bearish)" }}>
            Bearish Factors
          </h3>
        </div>
        <ul className="mt-3 space-y-2.5">
          {bearish.length === 0 && <li className="text-sm text-text-secondary">None identified today.</li>}
          {bearish.map((factor, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-text-primary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "var(--bearish)" }} />
              {factor}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
