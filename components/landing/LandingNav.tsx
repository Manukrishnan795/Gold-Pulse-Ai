import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#drivers", label: "Gold Drivers" },
  { href: "#product", label: "What You Get" },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo size="md" />

        <nav className="hidden md:block">
          <ul className="flex items-center gap-7">
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

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-background transition-colors duration-150 hover:bg-gold-highlight"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
