import { Router } from "express";
import {
  showRegister,
  registerUser,
  showLogin,
  loginUser,
  logoutUser
} from "../controllers/auth.controller.js";
import { registerRules, loginRules } from "../middleware/auth.validation.js";

const router = Router();

router.get("/register", showRegister);
router.post("/register", registerRules, registerUser);

router.get("/login", showLogin);
router.post("/login", loginRules, loginUser);

router.post("/logout", logoutUser);

export default router;