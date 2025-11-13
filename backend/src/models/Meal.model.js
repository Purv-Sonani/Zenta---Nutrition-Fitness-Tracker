import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    // This is the most important line!
    // It links this meal to a specific User in the database.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add a meal name"],
      trim: true,
    },
    calories: {
      type: Number,
      required: [true, "Please add calories"],
    },
    // We'll make macros optional for now, defaulting to 0 if not provided
    protein: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now, // Defaults to the current time when created
    },
  },
  {
    timestamps: true,
  }
);

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
