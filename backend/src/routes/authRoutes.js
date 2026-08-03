import express from "express";
import { register, login } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/authController.js";
import {
  registerValidation,
  loginValidation,
  validateRequest,
} from "../middleware/authValidation.js";

const router = express.Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.get("/profile", authenticate, getProfile);

export default router;
