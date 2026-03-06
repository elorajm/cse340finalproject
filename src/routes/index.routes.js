import { Router } from "express";
import { getHome } from "../controllers/index.controller.js";
import dbtestRoutes from "./dbtest.routes.js";
import inventoryRoutes from "./inventory.routes.js";

const router = Router();

router.get("/", getHome);

router.use(dbtestRoutes);
router.use(inventoryRoutes);

export default router;