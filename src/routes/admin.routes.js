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
import {
  showPromotionHistory,
  showSendPromotion,
  sendPromotion,
  dismissPromotion
} from "../controllers/promotion.controller.js";
import { requireLogin, requireRole } from "../middleware/auth.js";
import { validateId } from "../middleware/validate-id.js";

const router = Router();

router.get("/owner",    requireRole("owner"),            showAdminDashboard);
router.get("/employee", requireRole("owner", "employee"), showEmployeeDashboard);
router.get("/dashboard", requireLogin,                   showUserDashboard);
router.get("/reviews",  requireRole("owner", "employee"), showReviewModeration);

// Vehicle CRUD (owner only)
router.get("/vehicles",           requireRole("owner"), showVehicleList);
router.get("/vehicles/new",       requireRole("owner"), showAddVehicleForm);
router.post("/vehicles/new",      requireRole("owner"), addVehicle);
router.get("/vehicles/edit/:id",  requireRole("owner"), validateId("id"), showEditVehicleForm);
router.post("/vehicles/edit/:id", requireRole("owner"), validateId("id"), editVehicle);
router.post("/vehicles/delete/:id", requireRole("owner"), validateId("id"), removeVehicle);

// Category CRUD (owner only)
router.get("/categories",           requireRole("owner"), showCategoryList);
router.get("/categories/new",       requireRole("owner"), showAddCategoryForm);
router.post("/categories/new",      requireRole("owner"), addCategory);
router.get("/categories/edit/:id",  requireRole("owner"), validateId("id"), showEditCategoryForm);
router.post("/categories/edit/:id", requireRole("owner"), validateId("id"), editCategory);
router.post("/categories/delete/:id", requireRole("owner"), validateId("id"), removeCategory);

// User management (owner only)
router.get("/users",              requireRole("owner"), showUserList);
router.post("/users/role/:id",    requireRole("owner"), validateId("id"), changeUserRole);

// Promotions (owner only to create; any logged-in user can dismiss)
router.get("/promotions",          requireRole("owner"), showPromotionHistory);
router.get("/promotions/new",      requireRole("owner"), showSendPromotion);
router.post("/promotions/new",     requireRole("owner"), sendPromotion);
router.post("/promotions/:id/dismiss", requireLogin, validateId("id"), dismissPromotion);

export default router;
