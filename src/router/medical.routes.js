import express from "express";
import {
  addMedicalRecord,
  getPatientHistory,
  getMyHistory, // 👈 ADD THIS
} from "../controllers/medical.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
const router = express.Router();

// 👨‍⚕️ Only Doctor can add
router.post("/", authMiddleware, roleMiddleware("DOCTOR"), addMedicalRecord);

router.get("/patient/:patientId", authMiddleware, getPatientHistory);

router.get(
  "/my-history",
  authMiddleware,
  roleMiddleware("PATIENT"),
  getMyHistory,
);

export default router;
