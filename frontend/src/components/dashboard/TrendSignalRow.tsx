import { ArrowUpRight, ArrowDownRight, Minus, Info } from "lucide-react";

type TrendDirection = "improving" | "declining" | "stable" | "insufficient_data";

interface TrendRowProps {
  label: string;
  direction: TrendDirection;
}

const config: Record<
  TrendDirection,
  {
    icon: React.ReactNode;
    color: string;
    text: string;
    confidence: string;
  }
> = {
  improving: {
    icon: <ArrowUpRight className="h-4 w-4" />,
    color: "text-green-600",
    text: "Improving",
    confidence: "Based on recent momentum",
  },
  declining: {
    icon: <ArrowDownRight className="h-4 w-4" />,
    color: "text-red-600",
    text: "Declining",
    confidence: "Needs attention",
  },
  stable: {
    icon: <Minus className="h-4 w-4" />,
    color: "text-(--text-muted)",
    text: "Stable",
    confidence: "No major change",
  },
  insufficient_data: {
    icon: <Info className="h-4 w-4" />,
    color: "text-(--text-muted)",
    text: "Not enough data",
    confidence: "Log more days",
  },
};

export function TrendRow({ label, direction }: TrendRowProps) {
  const cfg = config[direction];

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className={`p-2 rounded-md bg-(--surface-muted) ${cfg.color}`}>{cfg.icon}</span>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-(--text-muted)">{cfg.confidence}</p>
        </div>
      </div>

      <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.text}</span>
    </div>
  );
}
