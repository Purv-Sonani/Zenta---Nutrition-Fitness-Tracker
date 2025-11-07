import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// This middleware function will protect routes
export const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the http-only cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. If verified, find the user in the DB (without the password)
      // The `decoded.userId` comes from the payload we created in generateToken.js
      req.user = await User.findById(decoded.userId).select("-password");

      // 4. Call the next middleware or controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // If no token is found, send a 401 (Unauthorized) response
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
