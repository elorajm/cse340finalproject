import { Router } from "express";
import { showInventory, showVehicle } from "../controllers/inventory.controller.js";

const router = Router();

router.get("/inventory", showInventory);
router.get("/vehicle/:id", showVehicle);

export default router;