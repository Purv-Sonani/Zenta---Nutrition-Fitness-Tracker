import express from "express";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Credential endpoints are rate limited to blunt brute force and stuffing.
router.post("/register", authLimiter, registerUser);

router.post("/login", authLimiter, loginUser);

// These route is protected. User must be logged in.
router.get("/profile", protect, getUserProfile);

router.post("/logout", logoutUser);

export default router;
