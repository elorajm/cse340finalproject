import { validationResult } from "express-validator";
import {
  createReview,
  getReviewById,
  getReviewsByVehicleId,
  getUserVehicleReview,
  updateReview,
  deleteReview
} from "../models/review.model.js";
import { getVehicleById } from "../models/inventory.model.js";

export async function addReview(req, res, next) {
  try {
    const vehicleId = req.params.vehicleId;
    const userId = req.session.user.user_id;

    // Duplicate check first — before validation so the message is specific
    const existing = await getUserVehicleReview(userId, vehicleId);
    if (existing) {
      return res.redirect(`/vehicle/${vehicleId}?reviewError=duplicate`);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [vehicle, reviews] = await Promise.all([
        getVehicleById(vehicleId),
        getReviewsByVehicleId(vehicleId)
      ]);
      return res.status(400).render("catalog/vehicle", {
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        vehicle,
        reviews,
        userReview: null,
        reviewError: null,
        reviewFormErrors: errors.array(),
        reviewOld: req.body
      });
    }

    await createReview(vehicleId, userId, req.body.rating, req.body.comment);
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
