import { getLatestBrief, getAllRelevantArticles } from "@/lib/brief";
import { getDriverSnapshots } from "@/lib/drivers";
import { getUpcomingEvents } from "@/lib/events";
import { Header } from "@/components/layout/Header";
import { CommandBar } from "@/components/dashboard/CommandBar";
import { AtAGlanceStats } from "@/components/dashboard/AtAGlanceStats";
import { MarketPulse } from "@/components/dashboard/MarketPulse";
import { DriverMap } from "@/components/dashboard/DriverMap";
import { OvernightSummary } from "@/components/dashboard/OvernightSummary";
import { EconomicEvents } from "@/components/dashboard/EconomicEvents";
import { TopDevelopments } from "@/components/dashboard/TopDevelopments";
import { WhyItMatters } from "@/components/dashboard/WhyItMatters";
import { WatchList } from "@/components/dashboard/WatchList";
import { BullishBearish } from "@/components/dashboard/BullishBearish";
import { DeepDiveSection } from "@/components/dashboard/DeepDiveSection";
import { GoldDrivers } from "@/components/dashboard/GoldDrivers";
import { NewsSection } from "@/components/dashboard/NewsSection";
import { MorningTake } from "@/components/dashboard/MorningTake";
import { Sources } from "@/components/dashboard/Sources";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [brief, articles, driverSnapshots, events] = await Promise.all([
    getLatestBrief(),
    getAllRelevantArticles(),
    getDriverSnapshots(),
    getUpcomingEvents(),
  ]);

  const uniqueSources = new Set(articles.map((a) => a.source)).size;
  const highImpactEvents = events.filter((e) => e.importance === "high").length;

  const glanceStats = [
    { label: "Market Stories Today", value: brief?.stories.length ?? 0 },
    { label: "Watch Items", value: brief?.watch_list.length ?? 0 },
    { label: "High-Impact Events", value: highImpactEvents },
    { label: "Sources Analyzed", value: uniqueSources },
  ];

  return (
    <>
      <Header lastUpdated={brief?.created_at ?? null} />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-8 sm:py-10">
        {/* Tier 0 — 10 seconds: what's Gold doing, right now */}
        <CommandBar
          briefDate={brief?.brief_date ?? null}
          lastUpdated={brief?.created_at ?? null}
          sentiment={brief?.sentiment ?? null}
          confidence={brief?.confidence ?? null}
          marketScore={brief?.market_score ?? null}
          sixtySecondBrief={brief?.sixty_second_brief ?? null}
        />

        <AtAGlanceStats stats={glanceStats} />

        {/* Tier 1 — 3 minutes: why it's moving, what's today, what to watch */}
        <MarketPulse snapshots={driverSnapshots} />
        <DriverMap primary={brief?.primary_driver ?? null} secondary={brief?.secondary_driver ?? null} />
        <OvernightSummary items={brief?.overnight_summary ?? []} />
        <EconomicEvents events={events} />
        <TopDevelopments stories={brief?.stories ?? []} />
        <WhyItMatters topStory={brief?.stories?.[0] ?? null} invalidationNote={brief?.invalidation_note} />
        <WatchList items={brief?.watch_list ?? []} />
        <BullishBearish bullish={brief?.bullish_factors ?? []} bearish={brief?.bearish_factors ?? []} />

        {/* Tier 2 — 10 minutes: everything else, collapsed by default */}
        <DeepDiveSection>
          <GoldDrivers snapshots={driverSnapshots} />
          <NewsSection articles={articles} />
          <MorningTake text={brief?.ai_summary ?? null} />
          <Sources articles={articles} />
        </DeepDiveSection>
      </main>
    </>
  );
}
