import { Logo } from "@/components/common/Logo";
import { RefreshButton } from "./RefreshButton";
import { MobileNav } from "./MobileNav";
import { formatRelativeTime } from "@/lib/time";

const LINKS = [
  { href: "#brief", label: "Gold Brief" },
  { href: "#drivers", label: "Market Drivers" },
  { href: "#events", label: "Economic Calendar" },
  { href: "#news", label: "News" },
];

export function Header({ lastUpdated }: { lastUpdated: string | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <a href="/" aria-label="GoldPulse AI home">
            <Logo size="md" />
          </a>
          <nav className="hidden sm:block">
            <ul className="flex items-center gap-6">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="hidden font-mono text-xs text-text-secondary md:inline">
              Updated {formatRelativeTime(lastUpdated)}
            </span>
          )}
          <RefreshButton />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
