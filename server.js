import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

dotenv.config();

// Don't crash if DB fails — still export the app
connectDB().catch((err) => console.error("DB connection failed:", err.message));

export default app;