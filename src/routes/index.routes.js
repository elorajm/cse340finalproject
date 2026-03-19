import { Router } from "express";
import { getHome } from "../controllers/index.controller.js";
import dbtestRoutes from "./dbtest.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.get("/", getHome);
router.use(dbtestRoutes);
router.use(inventoryRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

export default router;
