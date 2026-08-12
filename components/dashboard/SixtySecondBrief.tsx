import { Timer } from "lucide-react";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";

export function SixtySecondBrief({ text }: { text: string | null }) {
  if (!text) {
    return (
      <EmptyState
        icon={Timer}
        title="No brief yet"
        description="The 60-second brief appears here once today's aggregation has run."
        compact
      />
    );
  }

  return (
    <Card className="border-l-2 p-5 sm:p-6" style={{ borderLeftColor: "var(--gold)" }}>
      <div className="flex items-center gap-2">
        <Timer size={16} className="text-gold" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
          60-Second Gold Brief
        </p>
      </div>
      <p className="mt-2 text-base font-medium leading-relaxed text-text-primary sm:text-lg">{text}</p>
    </Card>
  );
}
