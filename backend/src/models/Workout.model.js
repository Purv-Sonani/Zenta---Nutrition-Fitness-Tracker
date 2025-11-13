import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    activity: {
      type: String,
      required: [true, "Please add an activity name"], // e.g., "Running", "Bench Press"
      trim: true,
    },
    duration: {
      type: Number, // in minutes
      required: [true, "Please add duration in minutes"],
    },
    caloriesBurned: {
      type: Number,
      required: [true, "Please add calories burned"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
