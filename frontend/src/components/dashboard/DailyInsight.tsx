import { Card } from "@/src/components/ui/Card";
import { DashboardStatus } from "@/src/types/dashboard";

export function DailyInsight({ status }: { status: DashboardStatus }) {
  return (
    <Card className="p-6">
      <h2 className="font-semibold mb-2">Today’s Focus</h2>
      <p className="opacity-80 leading-relaxed">
        You are currently <strong>{status.replace(/([A-Z])/g, " $1")}</strong>. Focus on correcting one variable instead of over-adjusting.
      </p>
    </Card>
  );
}
