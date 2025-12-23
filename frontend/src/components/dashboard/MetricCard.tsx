import { Card } from "@/src/components/ui/Card";

export function MetricCard({ title, value, sub, icon }: { title: string; value: number; sub: string; icon: React.ReactNode }) {
  return (
    <Card className="p-6 flex justify-between items-start">
      <div>
        <p className="text-sm opacity-70">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <p className="text-xs opacity-60 mt-1">{sub}</p>
      </div>
      <div className="p-5 rounded-lg bg-primary/10 text-primary self-center">{icon}</div>
    </Card>
  );
}
