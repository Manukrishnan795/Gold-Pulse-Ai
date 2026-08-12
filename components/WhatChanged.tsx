import { Card } from "./ui/Card";

export function WhatChanged({ text }: { text: string | null }) {
  if (!text) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold">What Changed Since Yesterday</h2>
      <Card className="mt-3">
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{text}</p>
      </Card>
    </section>
  );
}
