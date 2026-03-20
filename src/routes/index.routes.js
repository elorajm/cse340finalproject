import { Router } from "express";
import { getHome } from "../controllers/index.controller.js";
import inventoryRoutes from "./inventory.routes.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import contactRoutes from "./contact.routes.js";
import reviewRoutes from "./review.routes.js";
import serviceRoutes from "./service.routes.js";

const router = Router();

router.get("/", getHome);

// DB test routes — development only, never expose in production
if (process.env.NODE_ENV !== "production") {
  const { default: dbtestRoutes } = await import("./dbtest.routes.js");
  router.use(dbtestRoutes);
}

router.use(inventoryRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/contact", contactRoutes);
router.use("/reviews", reviewRoutes);
router.use("/service", serviceRoutes);

export default router;
