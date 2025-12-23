import { Card } from "@/src/components/ui/Card";
import { GoalSuggestion } from "@/src/domain/dashboard/getGoalSuggestion";

export function GoalSuggestionCard({ suggestion }: { suggestion: GoalSuggestion }) {
  return (
    <Card className="p-5 space-y-2 opacity-90">
      <h3 className="text-sm font-medium uppercase tracking-wide opacity-70">Suggested adjustment</h3>

      <p className="font-medium">{suggestion.message}</p>

      {suggestion.hint && <p className="text-sm opacity-70">{suggestion.hint}</p>}
    </Card>
  );
}
