import { Router } from "express";
import {
  addReview,
  showEditReview,
  editReview,
  removeReview
} from "../controllers/review.controller.js";
import { requireLogin } from "../middleware/auth.js";
import { reviewRules } from "../middleware/review.validation.js";

const router = Router();

router.post("/:vehicleId", requireLogin, reviewRules, addReview);
router.get("/edit/:reviewId", requireLogin, showEditReview);
router.post("/edit/:reviewId", requireLogin, reviewRules, editReview);
router.post("/delete/:reviewId", requireLogin, removeReview);

export default router;