import { Router } from "express";
import {
  showAdminDashboard,
  showEmployeeDashboard,
  showUserDashboard
} from "../controllers/admin.controller.js";
import { requireLogin, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/owner", requireRole("owner"), showAdminDashboard);
router.get("/employee", requireRole("owner", "employee"), showEmployeeDashboard);
router.get("/dashboard", requireLogin, showUserDashboard);

export default router;