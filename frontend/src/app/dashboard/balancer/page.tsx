import MealBalancer from "@/src/components/nutrition/MealBalancer";

export default function BalancerPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Meal Balancer</h1>
        <p className="text-gray-500 mt-1">Not sure if your meal is balanced? Describe it below and let our AI suggest healthy additions.</p>
      </div>

      {/* The AI Component */}
      <MealBalancer />
    </div>
  );
}
