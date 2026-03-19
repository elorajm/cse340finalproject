import { Router } from "express";
import {
  showServiceForm,
  submitServiceRequest,
  showUserRequests,
  showAllRequests,
  updateStatus
} from "../controllers/service.controller.js";
import { requireLogin, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/new", requireLogin, showServiceForm);
router.post("/new", requireLogin, submitServiceRequest);

router.get("/my-requests", requireLogin, showUserRequests);

router.get("/admin", requireRole("owner", "employee"), showAllRequests);
router.post("/update/:id", requireRole("owner", "employee"), updateStatus);

export default router;