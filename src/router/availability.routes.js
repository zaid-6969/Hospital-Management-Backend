import express from "express";
import { getDoctorAvailability } from "../controllers/availability.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/doctor", authMiddleware, getDoctorAvailability);

export default router;
