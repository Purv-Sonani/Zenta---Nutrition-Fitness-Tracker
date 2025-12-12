import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config"; // Load environment variables
import authRoutes from "./api/auth.routes.js";
import cookieParser from "cookie-parser";
import mealRoutes from "./api/meal.routes.js";
import workoutRoutes from "./api/workout.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";


// Initialize the Express app
const app = express();

app.use(helmet()); // Adds various HTTP headers for security
app.use(cors());
app.use(express.json());
app.use(cookieParser());


// request to /api/auth will be handled by authRoutes
app.use("/api/auth", authRoutes);
// request to /api/meal will be handled by authRoutes
app.use("/api/meals", mealRoutes);
// request to /api/workouts will be handled by authRoutes
app.use("/api/workouts", workoutRoutes);

// Global Error Handler
app.use(errorHandler);

// app.get("/", (req, res) => {
//   res.send("FitFuel API is running with ES Modules!");
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
