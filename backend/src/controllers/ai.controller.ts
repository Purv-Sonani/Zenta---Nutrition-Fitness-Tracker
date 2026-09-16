import { NextFunction, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

import { generateNutritionSignals } from "../domain/ai/nutritionSignals.js";
import { nutritionInsightSchema, nutritionInsightSchemaGemini } from "../domain/ai/nutritionSchema.js";
import { buildNutritionPrompt } from "../domain/ai/nutritionPrompt.js";
import { normalizeNutritionInsight } from "../domain/ai/normalizeNutritionInsight.js";
import { buildNutritionContext } from "../domain/ai/nutritionAggregator.js";
import { buildMealBalancerPrompt } from "../domain/ai/mealBalancerPrompt.js";
import { mealBalancerResponseSchema, mealBalancerResponseSchemaGemini } from "../domain/ai/mealBalancerSchema.js";
import { balanceMealSchema } from "../utils/validation.js";
import { AppError } from "../middleware/error.middleware.js";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const GEMINI_MODEL = "gemini-2.5-flash-lite";

// Shown to the client when the model misbehaves. The specifics — raw output,
// validation issues — are logged server-side and never returned, so a caller
// cannot use this endpoint to probe our prompt or schema internals.
const AI_UNAVAILABLE = "The AI service is temporarily unavailable. Please try again.";

// @desc    Generate a nutrition insight from the user's last 7 days
// @route   GET /api/ai/nutrition-insight
// @access  Private
export const getNutritionInsight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Not authorized", 401);
    }

    const context = await buildNutritionContext(req.user.id);
    if (!context) {
      return res.status(200).json({ success: true, data: null });
    }

    const signals = generateNutritionSignals(context);

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: nutritionInsightSchemaGemini,
      },
    });

    const prompt = buildNutritionPrompt({
      goal: context.goal,
      today: context.today,
      last7Days: context.last7Days,
      signals,
    });

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let parsedRaw: unknown;
    try {
      parsedRaw = JSON.parse(raw);
    } catch {
      console.error("[AI] nutrition-insight returned non-JSON output:", raw);
      throw new AppError(AI_UNAVAILABLE, 502);
    }

    const normalized = normalizeNutritionInsight(parsedRaw);
    const validated = nutritionInsightSchema.safeParse(normalized);

    if (!validated.success) {
      console.error("[AI] nutrition-insight failed schema validation:", JSON.stringify(z.treeifyError(validated.error)), "normalized:", JSON.stringify(normalized));
      throw new AppError(AI_UNAVAILABLE, 502);
    }

    res.status(200).json({ success: true, data: validated.data });
  } catch (err) {
    next(err);
  }
};

// @desc    Suggest culturally appropriate additions to balance a meal
// @route   POST /api/ai/balance
// @access  Private
export const balanceMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input (Zod) — bounded length keeps prompt cost predictable
    //    and limits how much text an attacker can push at the model.
    const validation = balanceMealSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const { mealText } = validation.data;

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: mealBalancerResponseSchemaGemini,
      },
    });

    const result = await model.generateContent(buildMealBalancerPrompt(mealText));
    const raw = result.response.text();

    let parsedRaw: unknown;
    try {
      parsedRaw = JSON.parse(raw);
    } catch {
      console.error("[AI] balance returned non-JSON output:", raw);
      throw new AppError(AI_UNAVAILABLE, 502);
    }

    const validated = mealBalancerResponseSchema.safeParse(parsedRaw);

    if (!validated.success) {
      console.error("[AI] balance failed schema validation:", JSON.stringify(z.treeifyError(validated.error)), "parsed:", JSON.stringify(parsedRaw));
      throw new AppError(AI_UNAVAILABLE, 502);
    }

    // NOTE: this endpoint returns the bare object rather than the usual
    // { success, data } envelope, because the existing client reads
    // `response.data.analysis` directly. Changing it is a client change too.
    res.status(200).json(validated.data);
  } catch (err) {
    next(err);
  }
};
