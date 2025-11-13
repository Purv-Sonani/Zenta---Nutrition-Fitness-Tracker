import Workout from "../models/Workout.model.js";

// @desc    Log a new workout
// @route   POST /api/workouts
// @access  Private
export const addWorkout = async (req, res) => {
  const { activity, duration, caloriesBurned, date } = req.body;

  try {
    const workout = await Workout.create({
      user: req.user._id, // Get user from token
      activity,
      duration,
      caloriesBurned,
      date: date || Date.now(), // Allow manual date entry, or default to now
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all workouts for the user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
