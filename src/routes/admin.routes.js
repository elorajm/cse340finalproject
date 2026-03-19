import { Router } from "express";
import {
  showAdminDashboard,
  showEmployeeDashboard,
  showUserDashboard,
  showReviewModeration
} from "../controllers/admin.controller.js";
import {
  showVehicleList,
  showAddVehicleForm,
  addVehicle,
  showEditVehicleForm,
  editVehicle,
  removeVehicle
} from "../controllers/vehicle.controller.js";
import { requireLogin, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/owner", requireRole("owner"), showAdminDashboard);
router.get("/employee", requireRole("owner", "employee"), showEmployeeDashboard);
router.get("/dashboard", requireLogin, showUserDashboard);
router.get("/reviews", requireRole("owner", "employee"), showReviewModeration);

// Vehicle CRUD (owner only)
router.get("/vehicles", requireRole("owner"), showVehicleList);
router.get("/vehicles/new", requireRole("owner"), showAddVehicleForm);
router.post("/vehicles/new", requireRole("owner"), addVehicle);
router.get("/vehicles/edit/:id", requireRole("owner"), showEditVehicleForm);
router.post("/vehicles/edit/:id", requireRole("owner"), editVehicle);
router.post("/vehicles/delete/:id", requireRole("owner"), removeVehicle);

export default router;