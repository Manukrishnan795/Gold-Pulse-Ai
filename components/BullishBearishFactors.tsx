import { Card } from "./ui/Card";

export function BullishBearishFactors({
  bullish,
  bearish,
}: {
  bullish: string[];
  bearish: string[];
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <Card>
        <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Bullish Factors</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          {bullish.length === 0 && <li className="text-zinc-500">None identified today.</li>}
          {bullish.map((f, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">+</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h3 className="font-semibold text-rose-700 dark:text-rose-400">Bearish Factors</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          {bearish.length === 0 && <li className="text-zinc-500">None identified today.</li>}
          {bearish.map((f, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-rose-600 dark:text-rose-400">−</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
