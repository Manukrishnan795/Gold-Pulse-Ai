"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors duration-150 hover:bg-card-hover hover:text-text-primary disabled:opacity-60"
      aria-label="Refresh dashboard data"
    >
      <RefreshCw size={13} className={isPending ? "animate-spin" : ""} aria-hidden="true" />
      <span className="hidden sm:inline">Refresh</span>
    </button>
  );
}
