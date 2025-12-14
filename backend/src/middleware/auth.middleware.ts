import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js"; // .js extension is required!

// Define what our decoded token looks like
interface DecodedToken extends JwtPayload {
  userId: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Read the token from the cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // 1. Verify the token
      // We use '!' to tell TS we are sure the secret exists (checked in generateToken)
      const secret = process.env.JWT_SECRET!;

      const decoded = jwt.verify(token, secret) as DecodedToken;

      // 2. Find the user in the database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (user) {
        // 3. Remove the password from the object
        // destructure 'password' out and keep the rest in 'userWithoutPassword'
        const { password, ...userWithoutPassword } = user;

        // 4. Attach the user to the request object
        // cast as 'any' here to prevent strict type conflicts with Express definitions
        req.user = userWithoutPassword as any;

        next();
      } else {
        res.status(401).json({ message: "Not authorized, user not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
