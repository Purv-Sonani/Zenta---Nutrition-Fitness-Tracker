import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

// Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  // Get username, email, and password from the request body
  const { username, email, password } = req.body;

  try {
    // Check if user already exists (by email or username)
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      // 400 means "Bad Request"
      return res.status(400).json({ message: "User already exists" });
    }

    // If user doesn't exist, hash the password
    // A "salt" adds random characters to the password before hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Responnse with the new user's data (without the password)
    if (newUser) {
      res.status(201).json({
        // 201 means "Created"
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: error.message });
  }
};
