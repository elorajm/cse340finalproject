import { Router } from "express";
import { toggleWishlist } from "../controllers/wishlist.controller.js";
import { requireLogin } from "../middleware/auth.js";

const router = Router();

router.post("/toggle/:id", requireLogin, toggleWishlist);

export default router;
