import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./router/auth.routes.js";
import medicalRoutes from "./router/medical.routes.js";
import availabilityRoutes from "./router/availability.routes.js";
import appointmentRoutes from "./router/appointment.routes.js";
import doctorRoutes from "./router/doctor.routes.js";
import patientDetailsRoutes from "./router/patientDetails.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173git",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/medical", medicalRoutes);

app.use("/api/v1/availability", availabilityRoutes);

app.use("/api/v1/appointments", appointmentRoutes);

app.use("/api/v1/doctors", doctorRoutes);

app.use("/api/v1/patient-details", patientDetailsRoutes);

export default app;
