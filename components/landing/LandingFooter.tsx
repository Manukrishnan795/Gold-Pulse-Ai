import { Logo } from "@/components/common/Logo";

export function LandingFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Logo size="sm" />
          <p className="mt-2 text-sm text-text-secondary">Know what moved Gold before you trade.</p>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-text-secondary">
          AI-generated market analysis for informational purposes only. Not financial advice.
          Verify important information with original sources before making financial decisions.
        </p>
      </div>
    </footer>
  );
}
