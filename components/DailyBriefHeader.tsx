import { Badge } from "./ui/Badge";
import { sentimentTone, formatBriefDate } from "@/lib/sentiment";

export function DailyBriefHeader({
  briefDate,
  sentiment,
  confidence,
  marketScore,
}: {
  briefDate: string;
  sentiment: string;
  confidence: number;
  marketScore: number;
}) {
  const tone = sentimentTone(sentiment);

  return (
    <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">GOLD DAILY BRIEF</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{formatBriefDate(briefDate)}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Overall Sentiment</p>
          <div className="mt-1">
            <Badge tone={tone}>{sentiment}</Badge>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Confidence</p>
          <p className="mt-1 text-lg font-semibold">{confidence}%</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Market Score</p>
          <p className="mt-1 text-lg font-semibold">{marketScore.toFixed(1)} / 10</p>
        </div>
      </div>
    </div>
  );
}
