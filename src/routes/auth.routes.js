import { Router } from "express";
import {
  showRegister,
  registerUser,
  showLogin,
  loginUser,
  logoutUser
} from "../controllers/auth.controller.js";
import { registerRules, loginRules } from "../middleware/auth.validation.js";
import { requireLogin, redirectIfLoggedIn } from "../middleware/auth.js";

const router = Router();

router.get("/register", redirectIfLoggedIn, showRegister);
router.post("/register", redirectIfLoggedIn, registerRules, registerUser);

router.get("/login", redirectIfLoggedIn, showLogin);
router.post("/login", redirectIfLoggedIn, loginRules, loginUser);

router.post("/logout", requireLogin, logoutUser);

export default router;