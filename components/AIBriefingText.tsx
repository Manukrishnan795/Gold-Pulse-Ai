import { Card } from "./ui/Card";

export function AIBriefingText({ text }: { text: string }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">AI Morning Briefing</h2>
      <Card className="mt-3">
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{text}</p>
      </Card>
    </section>
  );
}
