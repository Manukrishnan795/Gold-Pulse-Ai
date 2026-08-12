import { Compass, Scale, CalendarClock, Bot } from "lucide-react";

const FEATURES = [
  {
    icon: Compass,
    title: "10 Gold Drivers Tracked",
    description:
      "USD, Fed policy, Treasury yields, inflation, employment, geopolitics, central banks, ETFs, oil, and risk sentiment — watched continuously.",
  },
  {
    icon: Scale,
    title: "Bullish vs. Bearish, Clearly Split",
    description:
      "Every day's factors sorted into what's supportive and what's creating pressure — no burying the lede in paragraphs.",
  },
  {
    icon: CalendarClock,
    title: "Gold-Relevant Economic Events",
    description:
      "Only the releases that actually move Gold — not a generic calendar of every country's every data point.",
  },
  {
    icon: Bot,
    title: "AI Morning Take",
    description:
      "One tight, plain-language paragraph answering the only question that matters: what does a Gold trader need to know right now?",
  },
];

export function Features() {
  return (
    <section id="product" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">What You Get</p>
      <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
        Everything a Gold trader checks each morning, in one place
      </h2>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="rounded-lg border border-border bg-card p-5">
              <Icon size={20} className="text-gold" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold text-text-primary">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
