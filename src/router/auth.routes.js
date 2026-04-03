import express from "express"
import {register , login , logout, getUsersByRole} from "../controllers/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router()

router.post("/register" , register )
router.post("/login" , login)
router.post("/logout" , logout)
router.get("/users", authMiddleware, roleMiddleware("ADMIN"), getUsersByRole)

export default router