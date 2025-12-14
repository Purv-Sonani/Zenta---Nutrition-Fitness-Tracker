import express from "express";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// These route is protected. User must be logged in.
router.get("/profile", protect, getUserProfile);

router.post("/logout", logoutUser);

export default router;
