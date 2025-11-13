import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Create the token
  const token = jwt.sign(
    { userId }, // This is the data (payload) we want to store in the token
    process.env.JWT_SECRET, // The secret key
    { expiresIn: "30d" } // The token will expire in 30 days
  );

  // send the token back in an http-only cookie.
  // This is a more secure method than just sending it in the JSON body.
  // httpOnly: true -> Prevents the cookie from being accessed by client-side JavaScript.
  // secure: true -> Cookie will only be sent over HTTPS (in production).
  // sameSite: 'strict' -> Helps prevent cross-site request forgery (CSRF).
  res.cookie("jwt", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV !== "development", // Use secure in production
    secure: false, // Use secure in production
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

export default generateToken;
