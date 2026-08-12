import { ExternalLink } from "lucide-react";
import { Card } from "@/components/common/Card";
import { ImpactBadge, ImportanceBadge } from "@/components/common/Badge";
import { formatRelativeTime } from "@/lib/time";
import type { NewsArticleView } from "@/lib/brief";

const ACCENT_COLOR = {
  bullish: "var(--bullish)",
  bearish: "var(--bearish)",
  neutral: "var(--neutral)",
} as const;

export function NewsCard({ article }: { article: NewsArticleView }) {
  return (
    <Card
      hover
      className="border-l-2 p-3.5 sm:p-4"
      style={{ borderLeftColor: ACCENT_COLOR[article.impact] }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-start gap-1 text-sm font-medium text-text-primary hover:underline"
        >
          {article.title}
          <ExternalLink
            size={12}
            className="mt-1 shrink-0 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </a>
      </div>

      <p className="mt-1 text-xs text-text-secondary">
        {article.source} · {formatRelativeTime(article.published_at)}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <ImpactBadge impact={article.impact} />
        <ImportanceBadge importance={article.importance} />
        <span className="font-mono text-xs text-text-secondary">
          Relevance: {article.relevance_score}%
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{article.summary}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-text-primary">
        <span className="font-medium text-gold-highlight">Why it matters — </span>
        {article.why_it_matters}
      </p>
    </Card>
  );
}
