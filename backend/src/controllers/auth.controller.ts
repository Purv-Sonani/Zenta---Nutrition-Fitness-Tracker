import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { prisma } from "../../prisma/client.js";

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user exists
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    if (newUser) {
      // Generate token immediately
      generateToken(res, newUser.id);

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    res.status(500).json({ message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Check password
    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user.id);

      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    res.status(500).json({ message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};