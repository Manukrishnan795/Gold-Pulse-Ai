import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Impact, Importance } from "@/lib/types";

const IMPACT_CONFIG: Record<Impact, { label: string; icon: typeof TrendingUp; color: string; bg: string }> = {
  bullish: { label: "Bullish", icon: TrendingUp, color: "var(--bullish)", bg: "var(--bullish-bg)" },
  bearish: { label: "Bearish", icon: TrendingDown, color: "var(--bearish)", bg: "var(--bearish-bg)" },
  neutral: { label: "Neutral", icon: Minus, color: "var(--neutral)", bg: "var(--neutral-bg)" },
};

export function ImpactBadge({ impact, className = "" }: { impact: Impact; className?: string }) {
  const cfg = IMPACT_CONFIG[impact];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${className}`}
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Icon size={12} strokeWidth={2.5} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

const IMPORTANCE_LABEL: Record<Importance, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function ImportanceBadge({ importance, className = "" }: { importance: Importance; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-text-secondary ${className}`}
    >
      {IMPORTANCE_LABEL[importance]} importance
    </span>
  );
}
