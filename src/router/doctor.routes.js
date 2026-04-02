import express from "express";
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
  getAllDoctors,
  getDoctorStats,
  getMyDoctorStats,
  getMyDoctorProfile,
} from "../controllers/doctor.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// ─────────────────────────────────────────
// ✅ PUBLIC / GENERAL ROUTES
// ─────────────────────────────────────────

// GET ALL DOCTORS
router.get("/", getAllDoctors);

// ─────────────────────────────────────────
// 🔥 DOCTOR SELF ROUTES (VERY IMPORTANT)
// ─────────────────────────────────────────

// GET MY PROFILE
router.get("/me", authMiddleware, roleMiddleware("DOCTOR"), getMyDoctorProfile);

// GET MY STATS
router.get(
  "/stats/me",
  authMiddleware,
  roleMiddleware("DOCTOR"),
  getMyDoctorStats,
);

// ─────────────────────────────────────────
// 🔥 DYNAMIC ROUTES (MUST COME AFTER)
// ─────────────────────────────────────────

// GET STATS BY ID (ADMIN USE)
router.get("/stats/:id", getDoctorStats);

// GET DOCTOR BY ID
router.get("/:id", getDoctorById);

// ─────────────────────────────────────────
// 🔐 ADMIN ROUTES
// ─────────────────────────────────────────

// CREATE DOCTOR
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  createDoctor,
);

// UPDATE DOCTOR
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  updateDoctor,
);

// DELETE DOCTOR
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteDoctor);

export default router;
