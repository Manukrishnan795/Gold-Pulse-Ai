import { getLatestBrief, getAllRelevantArticles } from "@/lib/brief";
import { getDriverSnapshots } from "@/lib/drivers";
import { getUpcomingEvents } from "@/lib/events";
import { Header } from "@/components/layout/Header";
import { GoldHeader } from "@/components/dashboard/GoldHeader";
import { MarketSentiment } from "@/components/dashboard/MarketSentiment";
import { MarketPulse } from "@/components/dashboard/MarketPulse";
import { TopDevelopments } from "@/components/dashboard/TopDevelopments";
import { WhyItMatters } from "@/components/dashboard/WhyItMatters";
import { GoldDrivers } from "@/components/dashboard/GoldDrivers";
import { BullishBearish } from "@/components/dashboard/BullishBearish";
import { EconomicEvents } from "@/components/dashboard/EconomicEvents";
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

  return (
    <>
      <Header lastUpdated={brief?.created_at ?? null} />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-8 sm:py-10">
        <GoldHeader briefDate={brief?.brief_date ?? null} lastUpdated={brief?.created_at ?? null} />

        <MarketSentiment
          sentiment={brief?.sentiment ?? null}
          confidence={brief?.confidence ?? null}
          marketScore={brief?.market_score ?? null}
        />

        <MarketPulse snapshots={driverSnapshots} />

        <TopDevelopments developments={brief?.developments ?? []} />

        <WhyItMatters topDevelopment={brief?.developments?.[0] ?? null} />

        <GoldDrivers snapshots={driverSnapshots} />

        <BullishBearish bullish={brief?.bullish_factors ?? []} bearish={brief?.bearish_factors ?? []} />

        <EconomicEvents events={events} />

        <NewsSection articles={articles} />

        <MorningTake text={brief?.ai_summary ?? null} />

        <Sources articles={articles} />
      </main>
    </>
  );
}
