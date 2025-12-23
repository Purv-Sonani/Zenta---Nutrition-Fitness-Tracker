import Link from "next/link";
import { Card } from "@/src/components/ui/Card";
import { TodaysFocus } from "@/src/domain/dashboard/getTodaysFocus";

const CTA_MAP = {
  logMeal: {
    label: "Log Meal",
    href: "/dashboard/nutrition/new",
  },
  logWorkout: {
    label: "Log Workout",
    href: "/dashboard/workouts/new",
  },
};

export function DailyInsight({ focus }: { focus: TodaysFocus }) {
  return (
    <Card className="p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70">Today’s Focus</h2>
      </div>

      {/* Core message */}
      <div className="space-y-1">
        <p className="text-lg font-semibold">{focus.title}</p>
        <p className="opacity-80 leading-relaxed">{focus.description}</p>
      </div>

      {/* CTA */}
      {focus.cta && (
        <div className="pt-3">
          <Link href={CTA_MAP[focus.cta].href} className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            {CTA_MAP[focus.cta].label} →
          </Link>
        </div>
      )}
    </Card>
  );
}
