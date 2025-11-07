import express from "express";
import "dotenv/config"; // Load environment variables
import connectDB from "./config/db.js";
import authRoutes from "./api/auth.routes.js";

connectDB();

// Initialize the Express app
const app = express();

app.use(express.json());

// Any request to /api/auth will be handled by authRoutes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("FitFuel API is running with ES Modules!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
