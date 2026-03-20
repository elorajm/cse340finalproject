import {
  createPromotion,
  getAllPromotions,
  sendPromotionToUsers,
  markPromotionRead
} from "../models/promotion.model.js";
import { getAllUsers } from "../models/auth.model.js";

export async function showPromotionHistory(req, res, next) {
  try {
    const promotions = await getAllPromotions();
    res.render("admin/promotions", { title: "Promotions & Offers", promotions });
  } catch (error) {
    next(error);
  }
}

export async function showSendPromotion(req, res, next) {
  try {
    const users = await getAllUsers();
    res.render("admin/send-promotion", {
      title: "Send Promotion",
      users,
      errors: [],
      old: {}
    });
  } catch (error) {
    next(error);
  }
}

export async function sendPromotion(req, res, next) {
  try {
    const { title, message, discount_code, expires_at, target } = req.body;
    const errors = [];

    if (!title || !title.trim()) errors.push({ msg: "Title is required." });
    if (!message || !message.trim()) errors.push({ msg: "Message is required." });

    if (errors.length) {
      const users = await getAllUsers();
      return res.status(400).render("admin/send-promotion", {
        title: "Send Promotion",
        users,
        errors,
        old: req.body
      });
    }

    const promo = await createPromotion(
      title.trim(),
      message.trim(),
      discount_code?.trim() || null,
      expires_at || null,
      req.session.user.user_id
    );

    let recipientIds = [];

    if (target === "all") {
      const allUsers = await getAllUsers();
      recipientIds = allUsers.map(u => u.user_id);
    } else {
      // Specific users — comes in as a string (single) or array (multiple)
      const selected = req.body.user_ids;
      if (!selected) {
        req.flash("error", "Please select at least one recipient.");
        return res.redirect("/admin/promotions/new");
      }
      recipientIds = Array.isArray(selected)
        ? selected.map(Number)
        : [Number(selected)];
    }

    await sendPromotionToUsers(promo.promotion_id, recipientIds);

    req.flash("success", `Promotion sent to ${recipientIds.length} user${recipientIds.length !== 1 ? "s" : ""}.`);
    res.redirect("/admin/promotions");
  } catch (error) {
    next(error);
  }
}

export async function dismissPromotion(req, res, next) {
  try {
    await markPromotionRead(req.session.user.user_id, req.params.id);
    res.redirect("/admin/dashboard");
  } catch (error) {
    next(error);
  }
}
