export function Card({
  children,
  className = "",
  hover = false,
  as: As = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
  style?: React.CSSProperties;
}) {
  return (
    <As
      className={`rounded-lg border border-border bg-card ${hover ? "transition-colors duration-150 hover:bg-card-hover" : ""} ${className}`}
      style={style}
    >
      {children}
    </As>
  );
}
