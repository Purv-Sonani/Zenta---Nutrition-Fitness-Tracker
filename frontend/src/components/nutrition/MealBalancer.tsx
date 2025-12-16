"use client";

import { useState } from "react";
import { useAIStore } from "@/src/store/useAIStore"; // Import your new store
import { Loader2, Sparkles, PlusCircle, AlertCircle } from "lucide-react";

export default function MealBalancer() {
  const [input, setInput] = useState("");

  // Extract state and actions from the store
  const { analyzeMeal, balanceResult, isLoading, error } = useAIStore();

  const handleBalance = async () => {
    if (!input.trim()) return;
    await analyzeMeal(input);
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-gray-800">AI Meal Balancer</h2>
      </div>

      <div className="space-y-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Dal and Rice, or Toast with Jam..."
          className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none placeholder:text-gray-400"
          rows={3}
        />

        <button onClick={handleBalance} disabled={isLoading || !input} className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all disabled:opacity-50 font-medium text-sm">
          {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Balance My Meal"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Result State */}
      {balanceResult && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-sm text-gray-700 italic mb-4 font-medium">"{balanceResult.analysis}"</p>

          <div className="space-y-3">
            {balanceResult.suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <PlusCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Add {suggestion.item}</h4>
                  <p className="text-xs text-indigo-700 mt-1">
                    {suggestion.reason} ({suggestion.category})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
