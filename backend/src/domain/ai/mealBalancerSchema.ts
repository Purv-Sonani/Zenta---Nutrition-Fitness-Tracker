import { SchemaType, type ResponseSchema } from "@google/generative-ai";
import { z } from "zod";

export const MEAL_BALANCER_CATEGORIES = ["Protein", "Fiber", "Healthy Fat", "Micronutrients"] as const;

/**
 * Schema sent to Gemini as `responseSchema`, so the model is constrained to
 * emit this shape as raw JSON instead of prose wrapped in markdown fences.
 */
export const mealBalancerResponseSchemaGemini: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    analysis: {
      type: SchemaType.STRING,
      description: "One short sentence summarizing what the meal is missing.",
    },
    suggestions: {
      type: SchemaType.ARRAY,
      description: "2-3 culturally appropriate additions, or empty if the meal is already balanced.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          category: {
            type: SchemaType.STRING,
            format: "enum",
            enum: [...MEAL_BALANCER_CATEGORIES],
          },
          item: { type: SchemaType.STRING },
          reason: { type: SchemaType.STRING },
        },
        required: ["category", "item", "reason"],
      },
    },
  },
  required: ["analysis", "suggestions"],
};

/**
 * Defence in depth. Structured output makes malformed JSON unlikely, not
 * impossible — the model can still return schema-shaped nonsense such as an
 * empty analysis or a dozen suggestions — so the response is parsed again on
 * our side before it reaches the client.
 */
export const mealBalancerResponseSchema = z.object({
  analysis: z.string().min(1),
  suggestions: z
    .array(
      z.object({
        category: z.enum(MEAL_BALANCER_CATEGORIES),
        item: z.string().min(1),
        reason: z.string().min(1),
      })
    )
    .max(5),
});

export type MealBalancerResponse = z.infer<typeof mealBalancerResponseSchema>;
