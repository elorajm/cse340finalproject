import { Router } from "express";
import { showInventory, showVehicle } from "../controllers/inventory.controller.js";
import { validateId } from "../middleware/validate-id.js";

const router = Router();

router.get("/inventory", showInventory);
router.get("/vehicle/:id", validateId("id"), showVehicle);

export default router;