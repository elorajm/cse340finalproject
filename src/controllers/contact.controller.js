import { validationResult } from "express-validator";
import { createContactMessage, getAllContactMessages } from "../models/contact.model.js";

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
      messages
    });
  } catch (error) {
    next(error);
  }
}