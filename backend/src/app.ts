import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config"; // Load environment variables
import authRoutes from "./api/auth.routes.js";
import cookieParser from "cookie-parser";
import mealRoutes from "./api/meal.routes.js";
import workoutRoutes from "./api/workout.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import aiRoutes from "./api/ai.routes.js";
import progressRoutes from "./api/progress.routes.js";
import goalsRoutes from "./api/goals.routes.js";

// Initialize the Express app
const app = express();

app.use(helmet()); // Adds various HTTP headers for security
app.set("trust proxy", 1);
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.CLIENT_URL || ""],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// request to /api/auth will be handled by authRoutes
app.use("/api/auth", authRoutes);
// request to /api/meal will be handled by authRoutes
app.use("/api/meals", mealRoutes);
// request to /api/workouts will be handled by authRoutes
app.use("/api/workouts", workoutRoutes);
// request to /api/ai will be handled by aiRoutes
app.use("/api/ai", aiRoutes);
// request to /api/progress will be handled by progressRoutes
app.use("/api/progress", progressRoutes);
// request to /api/goals will be handled by goalsRoutes
app.use("/api/goals", goalsRoutes);

// Global Error Handler
app.use(errorHandler);

// app.get("/", (req, res) => {
//   res.send("FitFuel API is running with ES Modules!");
// });

export default app;
