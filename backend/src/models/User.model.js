import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes whitespace from both ends
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Stores the email in lowercase
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // This option adds two fields to our schema: createdAt and updatedAt
    timestamps: true,
  }
);

// Create the model from the schema
const User = mongoose.model("User", userSchema);

export default User;
