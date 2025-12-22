"use client";

import { useProgressStore } from "@/src/store/useProgressStore";
import { Badge } from "@/src/components/ui/Badge";

export function PatternWarnings() {
  const { patterns } = useProgressStore();

  if (!patterns || patterns.warnings.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Insights</h2>
      <div className="flex flex-wrap gap-2">
        {patterns.warnings.map((w, i) => (
          <Badge key={i} text={w} />
        ))}
      </div>
    </div>
  );
}
