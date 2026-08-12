import { ShieldCheck } from "lucide-react";
import type { NewsArticleView } from "@/lib/brief";

export function Sources({ articles }: { articles: NewsArticleView[] }) {
  const counts = new Map<string, number>();
  for (const article of articles) {
    counts.set(article.source, (counts.get(article.source) ?? 0) + 1);
  }

  return (
    <section className="border-t border-border pt-6">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-text-secondary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-text-primary">Sources &amp; Trust</h2>
      </div>

      {counts.size > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {[...counts.entries()].map(([source, count]) => (
            <span
              key={source}
              className="rounded-md border border-border px-2.5 py-1 text-xs text-text-secondary"
            >
              {source} <span className="font-mono text-text-primary">({count})</span>
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 max-w-2xl text-xs leading-relaxed text-text-secondary">
        AI-generated market analysis for informational purposes only. It is not financial advice.
        Verify important information with original sources before making financial decisions.
      </p>
    </section>
  );
}
