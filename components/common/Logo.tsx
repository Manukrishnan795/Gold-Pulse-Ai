const SIZES = {
  sm: { mark: 22, text: "text-base", tracking: "tracking-tight" },
  md: { mark: 26, text: "text-lg", tracking: "tracking-tight" },
} as const;

export function Logo({ size = "md" }: { size?: keyof typeof SIZES }) {
  const cfg = SIZES[size];

  return (
    <div className="flex items-center gap-2">
      <svg
        width={cfg.mark}
        height={cfg.mark}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="16" cy="16" r="15" stroke="#D4A72C" strokeWidth="1.5" opacity="0.35" />
        <path
          d="M4 17h4.5l2-6 3.5 12 3-16 2.5 10h8.5"
          stroke="#D4A72C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className={`${cfg.text} ${cfg.tracking} font-semibold text-text-primary`}>
        GoldPulse<span className="text-gold"> AI</span>
      </span>
    </div>
  );
}
