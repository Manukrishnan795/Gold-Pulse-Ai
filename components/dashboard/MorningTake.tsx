import { Bot } from "lucide-react";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";

export function MorningTake({ text }: { text: string | null }) {
  if (!text) {
    return (
      <EmptyState
        icon={Bot}
        title="No morning take yet"
        description="Generated once the daily aggregation pipeline has run for today."
      />
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2">
        <Bot size={18} className="text-gold" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-text-primary">AI Morning Take</h2>
      </div>
      <Card className="mt-3 p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-text-primary sm:text-[15px]">{text}</p>
      </Card>
    </section>
  );
}
