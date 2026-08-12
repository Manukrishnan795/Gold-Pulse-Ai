export function Card({
  children,
  className = "",
  hover = false,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
}) {
  return (
    <As
      className={`rounded-lg border border-border bg-card ${hover ? "transition-colors duration-150 hover:bg-card-hover" : ""} ${className}`}
    >
      {children}
    </As>
  );
}
