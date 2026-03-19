import { validationResult } from "express-validator";
import {
  createReview,
  getReviewById,
  updateReview,
  deleteReview
} from "../models/review.model.js";
import { getVehicleById } from "../models/inventory.model.js";

export async function addReview(req, res, next) {
  try {
    const errors = validationResult(req);
    const vehicleId = req.params.vehicleId;

    if (!errors.isEmpty()) {
      return res.status(400).send("Validation failed.");
    }

    await createReview(
      vehicleId,
      req.session.user.user_id,
      req.body.rating,
      req.body.comment
    );

    res.redirect(`/vehicle/${vehicleId}`);
  } catch (error) {
    next(error);
  }
}

export async function showEditReview(req, res, next) {
  try {
    const review = await getReviewById(req.params.reviewId);

    if (!review) {
      return res.status(404).send("Review not found.");
    }

    if (
      review.user_id !== req.session.user.user_id &&
      req.session.user.role !== "owner" &&
      req.session.user.role !== "employee"
    ) {
      return res.status(403).send("Access denied.");
    }

    const vehicle = await getVehicleById(review.vehicle_id);

    res.render("reviews/edit-review", {
      title: "Edit Review",
      review,
      vehicle,
      errors: []
    });
  } catch (error) {
    next(error);
  }
}

export async function editReview(req, res, next) {
  try {
    const errors = validationResult(req);
    const review = await getReviewById(req.params.reviewId);

    if (!review) {
      return res.status(404).send("Review not found.");
    }

    if (
      review.user_id !== req.session.user.user_id &&
      req.session.user.role !== "owner" &&
      req.session.user.role !== "employee"
    ) {
      return res.status(403).send("Access denied.");
    }

    if (!errors.isEmpty()) {
      const vehicle = await getVehicleById(review.vehicle_id);

      return res.status(400).render("reviews/edit-review", {
        title: "Edit Review",
        review: { ...review, ...req.body },
        vehicle,
        errors: errors.array()
      });
    }

    await updateReview(req.params.reviewId, req.body.rating, req.body.comment);

    res.redirect(`/vehicle/${review.vehicle_id}`);
  } catch (error) {
    next(error);
  }
}

export async function removeReview(req, res, next) {
  try {
    const review = await getReviewById(req.params.reviewId);

    if (!review) {
      return res.status(404).send("Review not found.");
    }

    if (
      review.user_id !== req.session.user.user_id &&
      req.session.user.role !== "owner" &&
      req.session.user.role !== "employee"
    ) {
      return res.status(403).send("Access denied.");
    }

    const vehicleId = review.vehicle_id;

    await deleteReview(req.params.reviewId);

    res.redirect(`/vehicle/${vehicleId}`);
  } catch (error) {
    next(error);
  }
}