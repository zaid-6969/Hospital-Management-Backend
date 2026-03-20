import dontenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/database.js"

dontenv.config();

const PORT = process.env.PORT || 5000;

connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
