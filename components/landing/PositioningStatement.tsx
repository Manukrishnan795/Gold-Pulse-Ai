import { ShieldOff } from "lucide-react";

export function PositioningStatement() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 sm:flex-row sm:items-center sm:py-14">
        <ShieldOff size={24} className="shrink-0 text-text-secondary" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Market intelligence, not trading signals.
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
            GoldPulse never tells you to buy or sell, and never promises guaranteed outcomes. It
            explains what&apos;s happening and why it might matter — bullish, bearish, or neutral —
            so you can make your own call with better context.
          </p>
        </div>
      </div>
    </section>
  );
}
