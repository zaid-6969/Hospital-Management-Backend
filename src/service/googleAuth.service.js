import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const handleGoogleAuth = async (token) => {
  // 1. Verify token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { email, name } = payload;

  // 2. Check if user exists
  let user = await User.findOne({ email });

  // 3. If not → create user
  if (!user) {
    user = await User.create({
      name,
      email,
      password: "GOOGLE_USER", // dummy password
      role: "PATIENT",
    });
  }

  // 4. Generate JWT
  const jwtToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token: jwtToken };
};