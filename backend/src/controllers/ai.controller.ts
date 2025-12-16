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

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Strict Prompt Engineering
    const prompt = `
You are an AI Meal Balancer specialized in culturally appropriate suggestions. Your goal is to make meals more nutritionally complete by suggesting ADDITIONS, not removals.

User Meal: "${mealText}"

Rules:
1. Analyze the meal for gaps in Protein, Fiber, and Healthy Fats.
2. If the meal already has sufficient Protein, Fiber, and Healthy Fats, respond with:
   {
     "analysis": "Already Balanced Meal",
     "suggestions": []
   }
3. Suggest 2-3 specific, realistic food items that would naturally be eaten with this meal in its cultural context if it is not already balanced.
   - E.g., For Dal + Rice (Indian), suggest vegetables, chapati, or buttermilk, not almonds or unrelated ingredients.
4. Do NOT suggest removing anything.
5. Do NOT suggest items that are unusual or unlikely to be combined with the meal.
6. Avoid medical terminology and calorie mentions.
7. Keep the tone casual and encouraging.
8. Return ONLY valid JSON in this format if meal is not already balanced:

{
  "analysis": "Short sentence summarizing what is missing (e.g., 'This meal is great for energy but could use more protein.')",
  "suggestions": [
    {
      "category": "Protein" | "Fiber" | "Healthy Fat" | "Micronutrients",
      "item": "Name of culturally appropriate food (e.g., 'A small bowl of curd')",
      "reason": "Short benefit (e.g., 'Adds protein naturally without changing meal taste')"
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
