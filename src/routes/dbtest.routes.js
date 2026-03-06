import { Router } from "express";
import { getDbTest } from "../controllers/dbtest.controller.js";

const router = Router();

router.get("/dbtest", getDbTest);

export default router;