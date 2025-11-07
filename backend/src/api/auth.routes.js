import express from "express";
import { registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

// When a POST request is made to /register, run the registerUser controller
router.post("/register", registerUser);

export default router;
