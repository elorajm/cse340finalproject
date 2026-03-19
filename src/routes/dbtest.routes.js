import { Router } from "express";
import { getDbTest, getDbInfo } from "../controllers/dbtest.controller.js";

const router = Router();

router.get("/dbtest", getDbTest);
router.get("/dbinfo", getDbInfo);

export default router;