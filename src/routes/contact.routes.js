import { Router } from "express";
import {
  showContactForm,
  submitContactForm,
  showContactMessages
} from "../controllers/contact.controller.js";
import { contactRules } from "../middleware/contact.validation.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", showContactForm);
router.post("/", contactRules, submitContactForm);

// employee and owner can view messages
router.get("/messages", requireRole("owner", "employee"), showContactMessages);

export default router;