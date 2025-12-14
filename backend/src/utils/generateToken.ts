import jwt from "jsonwebtoken";
import { Response } from "express"; // Import Response type from Express

const generateToken = (res: Response, userId: string) => {
  // 1. Get the secret
  const secret = process.env.JWT_SECRET;

  // 2. Safety Check: If it doesn't exist, throw an error to crash safely
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment!");
  }

  // 3. Generate Token
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "30d",
  });

  // 4. Set Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
