import { Router } from "express";
import {
  showContactForm,
  submitContactForm,
  showContactMessages,
  updateMessageStatus
} from "../controllers/contact.controller.js";
import { contactRules } from "../middleware/contact.validation.js";
import { requireRole } from "../middleware/auth.js";
import { validateId } from "../middleware/validate-id.js";

const router = Router();

router.get("/", showContactForm);
router.post("/", contactRules, submitContactForm);

// employee and owner can view and manage messages
router.get("/messages", requireRole("owner", "employee"), showContactMessages);
router.post("/messages/update/:id", requireRole("owner", "employee"), validateId("id"), updateMessageStatus);

export default router;