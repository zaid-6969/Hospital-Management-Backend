import app from "../src/app.js"; 
import connectDB from "../src/config/database.js";

export default async function handler(req, res) {
  await connectDB(); // 🔥 REQUIRED
  return app(req, res);
}
