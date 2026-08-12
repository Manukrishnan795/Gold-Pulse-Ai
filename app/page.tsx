import { getLatestBrief } from "@/lib/brief";
import { DailyBriefHeader } from "@/components/DailyBriefHeader";
import { TopDevelopments } from "@/components/TopDevelopments";
import { BullishBearishFactors } from "@/components/BullishBearishFactors";
import { AIBriefingText } from "@/components/AIBriefingText";
import { WhatChanged } from "@/components/WhatChanged";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const brief = await getLatestBrief();

  if (!brief) {
    return (
      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">GOLDPULSE AI</p>
        <h1 className="mt-2 text-xl font-semibold">No briefing yet</h1>
        <p className="mt-2 text-sm text-zinc-500">
          The pipeline hasn&apos;t generated a Gold daily brief yet. Once ingestion, analysis, and
          aggregation have run, today&apos;s brief will appear here.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <DailyBriefHeader
        briefDate={brief.brief_date}
        sentiment={brief.sentiment}
        confidence={brief.confidence}
        marketScore={brief.market_score}
      />

      <div className="mt-8 space-y-8">
        <AIBriefingText text={brief.ai_summary} />
        <BullishBearishFactors bullish={brief.bullish_factors} bearish={brief.bearish_factors} />
        <TopDevelopments developments={brief.developments} />
        <WhatChanged text={brief.what_changed} />
      </div>

      <footer className="mt-12 border-t border-zinc-200 pt-4 text-xs text-zinc-400 dark:border-zinc-800">
        GoldPulse AI is a market-intelligence tool, not financial advice. Nothing here is a
        recommendation to buy or sell.
      </footer>
    </main>
  );
}
