import { z } from "zod";

export const nutritionInsightSchema = z.object({
  diagnosis: z.string(),
  confidence: z.number().min(0).max(1),

  root_causes: z.array(z.string()),

  recommendations: z.array(
    z.object({
      action: z.string(),
      impact: z.string(),
    })
  ),

  prediction: z.object({
    if_continue: z.string(),
    minimum_fix_today: z.string(),
  }),

  explainability: z.object({
    triggered_by: z.array(z.string()),
    ignored_factors: z.array(z.string()),
  }),

  warning: z.string().optional(),
});
