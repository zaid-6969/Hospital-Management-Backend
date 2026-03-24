import express from "express";
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
  getAllDoctors,
} from "../controllers/doctor.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import upload from "../middleware/multer.js";
import { getMyDoctorProfile } from "../controllers/doctor.controller.js";
const router = express.Router();

//  GET ALL
router.get("/", getAllDoctors);

//  GET BY ID
router.get(
  "/:id",
  // authMiddleware,
  getDoctorById,
);

//  CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  createDoctor,
);

//  UPDATE
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  updateDoctor,
);

//  DELETE
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteDoctor);


// LOGIN TO THE DOCTOR API
router.get("/me", authMiddleware, roleMiddleware("DOCTOR"), getMyDoctorProfile);

export default router;
