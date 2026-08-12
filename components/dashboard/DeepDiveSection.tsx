import { Microscope, ChevronDown } from "lucide-react";

export function DeepDiveSection({ children }: { children: React.ReactNode }) {
  return (
    <details className="group rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-3">
          <Microscope size={18} className="text-gold" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Deep Dive</p>
            <p className="text-xs text-text-secondary">
              Full news, all Gold drivers, economic calendar, sources — about 10 minutes
            </p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className="shrink-0 text-text-secondary transition-transform duration-150 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="space-y-10 border-t border-border p-4 pt-8 sm:p-5 sm:pt-10">{children}</div>
    </details>
  );
}
