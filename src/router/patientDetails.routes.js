import express from "express";
import {
  upsertPatientDetails,
  getPatientDetails,
  getMyPatientsDetails,
  deletePatientDetails,
} from "../controllers/patientDetails.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

// CREATE / UPDATE patient details for an appointment (Patient fills this in)
router.put(
  "/appointment/:appointmentId",
  authMiddleware,
  roleMiddleware("PATIENT", "RECEPTIONIST"),
  upsertPatientDetails
);

// GET patient details for a specific appointment
router.get(
  "/appointment/:appointmentId",
  authMiddleware,
  roleMiddleware("PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN"),
  getPatientDetails
);

// GET all patients' details for a doctor
router.get(
  "/doctor/:doctorId",
  authMiddleware,
  roleMiddleware("DOCTOR", "ADMIN"),
  getMyPatientsDetails
);

// DELETE (admin only)
router.delete(
  "/appointment/:appointmentId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deletePatientDetails
);

export default router;
