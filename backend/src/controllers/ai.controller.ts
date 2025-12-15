import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const balanceMeal = async (req: Request, res: Response) => {
  try {
    const { mealText } = req.body;

    if (!mealText) {
      return res.status(400).json({ error: "Meal description is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Strict Prompt Engineering
    const prompt = `
      You are an AI Meal Balancer. Your goal is to make meals more nutritionally complete by suggesting ADDITIONS, not removals.
      
      User Meal: "${mealText}"

      Rules:
      1. Analyze the meal for gaps in Protein, Fiber, and Healthy Fats.
      2. Suggest 2-3 specific, realistic food items to ADD to this meal to fill those gaps.
      3. Do NOT suggest removing anything.
      4. Do NOT use medical terminology (cure, treat, inflammation, etc.).
      5. Do NOT mention calories.
      6. Keep the tone encouraging and casual.

      Return ONLY valid JSON in this format:
      {
        "analysis": "Short sentence summarizing what is missing (e.g., 'This meal is great for energy but could use more protein.')",
        "suggestions": [
          {
            "category": "Protein" | "Fiber" | "Healthy Fat" | "Micronutrients",
            "item": "Name of food (e.g., 'A cup of Greek Yogurt')",
            "reason": "Short benefit (e.g., 'Improves satiety')"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Clean up the text to ensure it's pure JSON (sometimes AI adds markdown backticks)
    const text = response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(text);

    res.json(data);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to balance meal" });
  }
};
