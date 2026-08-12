import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

export function EmptyState({
  icon: Icon,
  title,
  description,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <Card className={`flex flex-col items-center justify-center text-center ${compact ? "py-6 px-4" : "py-12 px-6"}`}>
      <Icon className="text-text-secondary" size={compact ? 20 : 28} strokeWidth={1.5} aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-text-secondary">{description}</p>
    </Card>
  );
}
