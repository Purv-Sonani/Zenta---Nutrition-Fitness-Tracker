"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { Button, Input } from "@/src/components/ui";
import { nutritionService } from "@/src/services/nutrition.service";
import { useNutritionStore } from "@/src/store/useNutritionStore";

export default function NewMealPage() {
  const router = useRouter();
  const addMealToStore = useNutritionStore((state) => state.addMeal);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const newMeal = await nutritionService.create({
        name: formData.name,
        calories: Number(formData.calories),
        protein: Number(formData.protein),
        carbs: Number(formData.carbs),
        fat: Number(formData.fat),
        date: new Date(formData.date).toISOString(),
      });

      addMealToStore(newMeal);
      router.back();
      //   router.push("/dashboard/nutrition");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to log meal.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
        <Link href="/dashboard/nutrition" className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full">
          <FaArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Log Meal</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <Input id="name" name="name" label="Meal Name" placeholder="e.g. Grilled Chicken Salad" value={formData.name} onChange={handleChange} required autoFocus />

          <div className="grid grid-cols-2 gap-6">
            <Input id="calories" name="calories" label="Total Calories" type="number" suffix="kcal" value={formData.calories} onChange={handleChange} required />
            <Input id="date" name="date" label="Date" type="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input id="protein" name="protein" label="Protein" type="number" suffix="g" value={formData.protein} onChange={handleChange} required />
            <Input id="carbs" name="carbs" label="Carbs" type="number" suffix="g" value={formData.carbs} onChange={handleChange} required />
            <Input id="fat" name="fat" label="Fats" type="number" suffix="g" value={formData.fat} onChange={handleChange} required />
          </div>

          <div className="pt-6 flex gap-4">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              <FaSave className="mr-2 h-4 w-4" />
              Save Meal
            </Button>
            <Link href="/dashboard/nutrition">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
