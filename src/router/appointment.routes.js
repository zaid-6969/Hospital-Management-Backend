import express from "express";
import {
  createAppointment,
  acceptAppointment,
  rejectAppointment,
} from "../controllers/appointment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { getDoctorAppointments } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("PATIENT", "RECEPTIONIST"),
  createAppointment,
);

router.patch(
  "/:id/accept",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  acceptAppointment,
);

router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  rejectAppointment,
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  getDoctorAppointments,
);

export default router;
