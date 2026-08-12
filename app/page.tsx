import { getLatestBrief } from "@/lib/brief";
import { getPipelineStats } from "@/lib/stats";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { PipelineStory } from "@/components/landing/PipelineStory";
import { DriversTeaser } from "@/components/landing/DriversTeaser";
import { Features } from "@/components/landing/Features";
import { PositioningStatement } from "@/components/landing/PositioningStatement";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [brief, stats] = await Promise.all([getLatestBrief(), getPipelineStats()]);

  return (
    <>
      <LandingNav />
      <main className="flex-1">
        <Hero brief={brief} />
        <PipelineStory stats={stats} />
        <DriversTeaser />
        <Features />
        <PositioningStatement />
      </main>
      <LandingFooter />
    </>
  );
}
