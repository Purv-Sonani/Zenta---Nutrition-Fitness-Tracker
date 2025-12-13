import { Request, Response, NextFunction } from "express"; // Import NextFunction
import { prisma } from "../../prisma/client.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { registerSchema, loginSchema } from "../utils/validation.js"; // Import Zod schemas
import { AppError } from "../middleware/error.middleware.js";

// @desc    Register a new user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input (Zod)
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      // Throw formatted validation error
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const { username, email, password } = validation.data; // Use typed data

    // 2. Check existence
    const userExists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (userExists) {
      throw new AppError("User already exists", 400);
    }

    // 3. Create User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    generateToken(res, newUser.id);

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

// @desc    Login user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      throw new AppError(validation.error.issues[0].message, 400);
    }

    const { email, password } = validation.data;

    // 2. Find User
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    generateToken(res, user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Check if user ID exists (attached by 'protect' middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized, no user data" });
    }

    // 2. Fetch user from DB (excluding password)
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        // We strictly DO NOT select 'password' here
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Return the user data
    res.status(200).json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};
