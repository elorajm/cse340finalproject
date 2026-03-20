import { Router } from "express";
import {
  addReview,
  showEditReview,
  editReview,
  removeReview
} from "../controllers/review.controller.js";
import { requireLogin } from "../middleware/auth.js";
import { reviewRules } from "../middleware/review.validation.js";
import { validateId } from "../middleware/validate-id.js";

const router = Router();

router.post("/:vehicleId", requireLogin, validateId("vehicleId"), reviewRules, addReview);
router.get("/edit/:reviewId", requireLogin, validateId("reviewId"), showEditReview);
router.post("/edit/:reviewId", requireLogin, validateId("reviewId"), reviewRules, editReview);
router.post("/delete/:reviewId", requireLogin, validateId("reviewId"), removeReview);

export default router;