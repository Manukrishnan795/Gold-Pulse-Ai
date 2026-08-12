import { ALL_DRIVERS, DRIVER_LABELS } from "@/lib/drivers";

export function DriversTeaser() {
  return (
    <section id="drivers" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">Gold Drivers</p>
      <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
        The macro factors that actually move Gold
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
        Every driver below is tracked continuously and updated in the daily brief with its current
        direction and why it matters.
      </p>

      <div className="mt-8 flex flex-wrap gap-2.5">
        {ALL_DRIVERS.map((driver) => (
          <span
            key={driver}
            className="rounded-md border border-border bg-card px-3.5 py-2 text-sm text-text-primary"
          >
            {DRIVER_LABELS[driver]}
          </span>
        ))}
      </div>
    </section>
  );
}
