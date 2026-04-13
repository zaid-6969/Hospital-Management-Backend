import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./router/auth.routes.js";
import medicalRoutes from "./router/medical.routes.js";
import availabilityRoutes from "./router/availability.routes.js";
import appointmentRoutes from "./router/appointment.routes.js";
import doctorRoutes from "./router/doctor.routes.js";
import patientDetailsRoutes from "./router/patientDetails.routes.js";

const app = express(); // ✅ CREATE FIRST

const allowedOrigin = [
  "https://hospital-management-frontend-qayx.vercel.app",
  "http://localhost:5173",
];

// // ✅ MANUAL CORS (VERY IMPORTANT)
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   next();
// });

// ✅ cors middleware (keep it)
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// ✅ routes
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/medical", medicalRoutes);

app.use("/api/v1/availability", availabilityRoutes);

app.use("/api/v1/appointments", appointmentRoutes);

app.use("/api/v1/doctors", doctorRoutes);

app.use("/api/v1/patient-details", patientDetailsRoutes);

export default app;
