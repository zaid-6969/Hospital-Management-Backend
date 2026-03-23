import express from "express";
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
} from "../controllers/doctor.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  createDoctor,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  updateDoctor,
);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteDoctor);

router.get("/:id", authMiddleware, getDoctorById);

export default router;
