import Meal from "../models/Meal.model.js";

// @desc    Log a new meal
// @route   POST /api/meals
// @access  Private
export const addMeal = async (req, res) => {
  const { name, calories, protein, carbs, fat } = req.body;

  try {
    const meal = await Meal.create({
      name,
      calories,
      protein,
      carbs,
      fat,
      user: req.user._id, // We get this from the 'protect' middleware!
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all meals for the logged-in user
// @route   GET /api/meals
// @access  Private
export const getMeals = async (req, res) => {
  try {
    // Find meals where the 'user' field matches the ID of the currently logged-in user
    // .sort({ date: -1 }) means sort by date, newest first
    const meals = await Meal.find({ user: req.user._id }).sort({ date: -1 });

    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
