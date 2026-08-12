import { Card } from "@/components/common/Card";

interface Stat {
  label: string;
  value: number;
}

export function AtAGlanceStats({ stats }: { stats: Stat[] }) {
  return (
    <Card className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden p-0 sm:grid-cols-4 sm:divide-y-0">
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 text-center sm:p-5">
          <p className="font-mono text-2xl font-semibold text-text-primary">{stat.value}</p>
          <p className="mt-0.5 text-xs text-text-secondary">{stat.label}</p>
        </div>
      ))}
    </Card>
  );
}
