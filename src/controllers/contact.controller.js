import { validationResult } from "express-validator";
import {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus
} from "../models/contact.model.js";

const VALID_MESSAGE_STATUSES = ["received", "replied", "closed"];

export function showContactForm(req, res) {
  res.render("contact", {
    title: "Contact Us",
    errors: [],
    old: {}
  });
}

export async function submitContactForm(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("contact", {
        title: "Contact Us",
        errors: errors.array(),
        old: req.body
      });
    }

    const { name, email, subject, message } = req.body;

    await createContactMessage(name, email, subject, message);

    res.render("contact-success", {
      title: "Message Sent",
      name
    });
  } catch (error) {
    next(error);
  }
}

export async function showContactMessages(req, res, next) {
  try {
    const messages = await getAllContactMessages();

    res.render("admin/contact-messages", {
      title: "Contact Messages",
      messages,
      statusFilter: req.query.status || "all"
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMessageStatus(req, res, next) {
  try {
    const message = await getContactMessageById(req.params.id);
    if (!message) {
      const err = new Error("Message not found.");
      err.status = 404;
      return next(err);
    }

    const { status, notes } = req.body;
    if (!VALID_MESSAGE_STATUSES.includes(status)) {
      req.flash("error", "Invalid status.");
      return res.redirect("/contact/messages");
    }

    await updateContactMessageStatus(req.params.id, status, notes);
    req.flash("success", "Message status updated.");
    res.redirect("/contact/messages");
  } catch (error) {
    next(error);
  }
}
