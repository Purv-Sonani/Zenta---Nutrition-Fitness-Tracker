"use client";

import { useRouter } from "next/navigation";
import { GoalForm } from "@/src/components/goals/GoalForm";
import { useGoalsStore } from "@/src/store/useGoalsStore";

export default function EditGoalsPage() {
  const router = useRouter();
  const { goals, upsertGoals } = useGoalsStore();

  if (!goals) return null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Edit Goals</h1>
        <p className="text-(--text-muted)">Adjust your targets anytime to match your routine.</p>
      </header>

      <GoalForm
        initialValues={goals}
        submitLabel="Update Goals"
        onSubmit={async (data) => {
          await upsertGoals(data);
          router.push("/dashboard");
        }}
      />
    </div>
  );
}
