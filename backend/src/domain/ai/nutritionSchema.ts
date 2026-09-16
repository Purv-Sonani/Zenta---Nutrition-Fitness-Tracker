import { SchemaType, type ResponseSchema } from "@google/generative-ai";
import { z } from "zod";

/**
 * Schema sent to Gemini as `responseSchema`. It matches the canonical shape
 * below and the `NutritionInsight` interface the client consumes, so the
 * model, the normalizer, and the validator all describe the same object.
 */
export const nutritionInsightSchemaGemini: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    diagnosis: {
      type: SchemaType.STRING,
      description: "One or two sentences naming the dominant nutrition problem in the data.",
    },
    confidence: {
      type: SchemaType.NUMBER,
      description: "Confidence between 0 and 1, based on how much logged data supports the diagnosis.",
    },
    root_causes: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    recommendations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          action: { type: SchemaType.STRING },
          impact: { type: SchemaType.STRING },
        },
        required: ["action", "impact"],
      },
    },
    prediction: {
      type: SchemaType.OBJECT,
      properties: {
        risk: { type: SchemaType.STRING, description: "What happens if the current pattern continues." },
        timeframe: { type: SchemaType.STRING, description: "When that risk materializes, e.g. '7-14 days'." },
      },
      required: ["risk", "timeframe"],
    },
    explainability: {
      type: SchemaType.OBJECT,
      properties: {
        triggered_signals: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        reasoning: { type: SchemaType.STRING },
      },
      required: ["triggered_signals", "reasoning"],
    },
    warning: { type: SchemaType.STRING },
  },
  required: ["diagnosis", "confidence", "root_causes", "recommendations", "prediction", "explainability"],
};

/**
 * Canonical shape of a nutrition insight — the single source of truth shared
 * by `normalizeNutritionInsight`, this validator, and the client's
 * `NutritionInsight` type.
 */
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
    risk: z.string(),
    timeframe: z.string(),
  }),

  explainability: z.object({
    triggered_signals: z.array(z.string()),
    reasoning: z.string(),
  }),

  warning: z.string().optional(),
});
