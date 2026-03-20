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
import {
  showCategoryList,
  showAddCategoryForm,
  addCategory,
  showEditCategoryForm,
  editCategory,
  removeCategory
} from "../controllers/category.controller.js";
import {
  showUserList,
  changeUserRole
} from "../controllers/users.controller.js";
import { requireLogin, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/owner",    requireRole("owner"),            showAdminDashboard);
router.get("/employee", requireRole("owner", "employee"), showEmployeeDashboard);
router.get("/dashboard", requireLogin,                   showUserDashboard);
router.get("/reviews",  requireRole("owner", "employee"), showReviewModeration);

// Vehicle CRUD (owner only)
router.get("/vehicles",           requireRole("owner"), showVehicleList);
router.get("/vehicles/new",       requireRole("owner"), showAddVehicleForm);
router.post("/vehicles/new",      requireRole("owner"), addVehicle);
router.get("/vehicles/edit/:id",  requireRole("owner"), showEditVehicleForm);
router.post("/vehicles/edit/:id", requireRole("owner"), editVehicle);
router.post("/vehicles/delete/:id", requireRole("owner"), removeVehicle);

// Category CRUD (owner only)
router.get("/categories",           requireRole("owner"), showCategoryList);
router.get("/categories/new",       requireRole("owner"), showAddCategoryForm);
router.post("/categories/new",      requireRole("owner"), addCategory);
router.get("/categories/edit/:id",  requireRole("owner"), showEditCategoryForm);
router.post("/categories/edit/:id", requireRole("owner"), editCategory);
router.post("/categories/delete/:id", requireRole("owner"), removeCategory);

// User management (owner only)
router.get("/users",              requireRole("owner"), showUserList);
router.post("/users/role/:id",    requireRole("owner"), changeUserRole);

export default router;
