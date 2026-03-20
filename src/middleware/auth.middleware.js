import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANT FIX
    req.user = {
      id: decoded.id || decoded._id,   // handles both cases
      role: decoded.role
    };

    console.log("User from token:", req.user); // 👈 debug

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};