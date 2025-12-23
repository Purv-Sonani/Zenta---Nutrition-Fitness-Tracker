import { AlertTriangle, TrendingDown, Activity } from "lucide-react";

export type PatternType = "protein" | "workout";

interface PatternInsightProps {
  type: PatternType;
  title: string;
  description: string;
}

const config = {
  protein: {
    icon: <TrendingDown className="h-5 w-5 text-orange-500" />,
    bg: "bg-orange-50",
  },
  workout: {
    icon: <Activity className="h-5 w-5 text-red-500" />,
    bg: "bg-red-50",
  },
};

export function PatternInsight({ type, title, description }: PatternInsightProps) {
  const cfg = config[type];

  return (
    <div className={`flex gap-4 p-4 rounded-xl border border-(--border-subtle) ${cfg.bg}`}>
      <div className="mt-1">{cfg.icon}</div>

      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm text-(--text-muted) leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
