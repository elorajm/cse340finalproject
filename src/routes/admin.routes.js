import { Router } from "express";
import {
  showAdminDashboard,
  showEmployeeDashboard,
  showUserDashboard,
  showReviewModeration
} from "../controllers/admin.controller.js";
import { requireLogin, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/owner", requireRole("owner"), showAdminDashboard);
router.get("/employee", requireRole("owner", "employee"), showEmployeeDashboard);
router.get("/dashboard", requireLogin, showUserDashboard);
router.get("/reviews", requireRole("owner", "employee"), showReviewModeration);

export default router;