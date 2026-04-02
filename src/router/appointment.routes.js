import express from "express";
import {
  createAppointment,
  acceptAppointment,
  rejectAppointment,
  updateAppointmentStatus,
  getAllAppointments,
  assignDoctor,
  getDoctorAppointments,
  getAdminStats,
  deleteAppointment,
  getMyAppointmentsPatient,
  deleteMyAppointment,
} from "../controllers/appointment.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

// CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("PATIENT", "RECEPTIONIST"),
  createAppointment,
);

// ACCEPT
router.patch(
  "/:id/accept",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  acceptAppointment,
);

// REJECT
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  rejectAppointment,
);

// DOCTOR MY APPOINTMENTS
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  getDoctorAppointments,
);

// UPDATE STATUS
router.put(
  "/status/:id",
  authMiddleware,
  roleMiddleware("DOCTOR", "RECEPTIONIST"),
  updateAppointmentStatus,
);

// 🔥 FIXED → ADMIN ADDED
router.get(
  "/",
  authMiddleware,
  roleMiddleware("RECEPTIONIST", "ADMIN"),
  getAllAppointments,
);

// ASSIGN DOCTOR
router.put(
  "/assign/:id",
  authMiddleware,
  roleMiddleware("RECEPTIONIST"),
  assignDoctor,
);

// ADMIN STATS
router.get(
  "/admin/stats",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAdminStats,
);

// DELETE APPOINTMENT
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("RECEPTIONIST", "ADMIN"),
  deleteAppointment,
);


// PATIENT MY APPOINTMENTS
router.get(
  "/my/patient",
  authMiddleware,
  roleMiddleware("PATIENT"),
  getMyAppointmentsPatient
);

// ✅ PATIENT DELETE HIS APPOINTMENT
router.delete(
  "/my/:id",
  authMiddleware,
  roleMiddleware("PATIENT"),
  deleteMyAppointment
);

export default router;
