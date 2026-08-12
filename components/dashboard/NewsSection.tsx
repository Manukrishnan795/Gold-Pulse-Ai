"use client";

import { useMemo, useState } from "react";
import { Newspaper } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { NewsCard } from "./NewsCard";
import type { NewsArticleView } from "@/lib/brief";

type FilterKey = "all" | "bullish" | "bearish" | "neutral" | "high";
type SortKey = "relevance" | "recent" | "importance";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "bullish", label: "Bullish" },
  { key: "bearish", label: "Bearish" },
  { key: "neutral", label: "Neutral" },
  { key: "high", label: "High Importance" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Most Relevant" },
  { key: "recent", label: "Most Recent" },
  { key: "importance", label: "Highest Importance" },
];

const IMPORTANCE_WEIGHT = { high: 2, medium: 1, low: 0 } as const;

export function NewsSection({ articles }: { articles: NewsArticleView[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("relevance");

  const visible = useMemo(() => {
    let result = articles;
    if (filter === "high") {
      result = result.filter((a) => a.importance === "high");
    } else if (filter !== "all") {
      result = result.filter((a) => a.impact === filter);
    }

    return [...result].sort((a, b) => {
      if (sort === "recent") {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      }
      if (sort === "importance") {
        return IMPORTANCE_WEIGHT[b.importance] - IMPORTANCE_WEIGHT[a.importance];
      }
      return b.relevance_score - a.relevance_score;
    });
  }, [articles, filter, sort]);

  return (
    <section id="news" className="scroll-mt-16">
      <div className="flex items-center gap-2">
        <Newspaper size={18} className="text-gold" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-text-primary">Gold-Relevant News</h2>
        <span className="font-mono text-xs text-text-secondary">({articles.length})</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter news by impact">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
                filter === f.key
                  ? "border-gold bg-gold/10 text-gold-highlight"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-text-secondary">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-border bg-card px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-gold"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={Newspaper}
            title="No articles match this filter"
            description="Try a different filter — there are Gold-relevant articles for other impact categories today."
            compact
          />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {visible.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
