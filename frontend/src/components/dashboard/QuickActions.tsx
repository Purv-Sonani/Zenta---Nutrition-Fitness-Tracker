import Link from "next/link";
import { Card } from "@/src/components/ui/Card";
import { FaArrowRight } from "react-icons/fa";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Action href="/dashboard/nutrition/new" label="Log Meal" />
      <Action href="/dashboard/workouts/new" label="Log Workout" />
    </div>
  );
}

function Action({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <Card className="p-4 flex items-center justify-between hover:ring-1 hover:ring-primary transition">
        <span className="font-medium">{label}</span>
        <FaArrowRight className="text-primary" />
      </Card>
    </Link>
  );
}
