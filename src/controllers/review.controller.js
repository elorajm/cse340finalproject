import { validationResult } from "express-validator";
import {
  createReview,
  createGeneralReview,
  getReviewById,
  getReviewsByVehicleId,
  getUserVehicleReview,
  updateReview,
  deleteReview,
  getAllReviews
} from "../models/review.model.js";
import { getVehicleById } from "../models/inventory.model.js";

function notFoundErr(msg) {
  const err = new Error(msg || "Not found.");
  err.status = 404;
  return err;
}

function forbiddenErr(msg) {
  const err = new Error(msg || "Access denied.");
  err.status = 403;
  return err;
}

function canModifyReview(review, user) {
  return (
    review.user_id === user.user_id ||
    user.role === "owner" ||
    user.role === "employee"
  );
}

export async function showReviewsPage(req, res, next) {
  try {
    const reviews = await getAllReviews();
    res.render("reviews/reviews", {
      title: "Customer Reviews",
      reviews,
      reviewFormErrors: null,
      reviewOld: null
    });
  } catch (error) {
    next(error);
  }
}

export async function addGeneralReview(req, res, next) {
  try {
    const userId = req.session.user.user_id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const reviews = await getAllReviews();
      return res.status(400).render("reviews/reviews", {
        title: "Customer Reviews",
        reviews,
        reviewFormErrors: errors.array(),
        reviewOld: req.body
      });
    }

    await createGeneralReview(userId, req.body.rating, req.body.comment);
    req.flash("success", "Thank you for your review!");
    res.redirect("/reviews");
  } catch (error) {
    next(error);
  }
}

export async function addReview(req, res, next) {
  try {
    const vehicleId = req.params.vehicleId;
    const userId = req.session.user.user_id;

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
    req.flash("success", "Your review has been posted. Thank you!");
    res.redirect(`/vehicle/${vehicleId}`);
  } catch (error) {
    next(error);
  }
}

export async function showEditReview(req, res, next) {
  try {
    const review = await getReviewById(req.params.reviewId);

    if (!review) return next(notFoundErr("Review not found."));
    if (!canModifyReview(review, req.session.user)) return next(forbiddenErr());

    const vehicle = review.vehicle_id ? await getVehicleById(review.vehicle_id) : null;

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
    const review = await getReviewById(req.params.reviewId);

    if (!review) return next(notFoundErr("Review not found."));
    if (!canModifyReview(review, req.session.user)) return next(forbiddenErr());

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const vehicle = review.vehicle_id ? await getVehicleById(review.vehicle_id) : null;
      return res.status(400).render("reviews/edit-review", {
        title: "Edit Review",
        review: { ...review, ...req.body },
        vehicle,
        errors: errors.array()
      });
    }

    await updateReview(req.params.reviewId, req.body.rating, req.body.comment);

    req.flash("success", "Your review has been updated.");
    res.redirect(review.vehicle_id ? `/vehicle/${review.vehicle_id}` : "/reviews");
  } catch (error) {
    next(error);
  }
}

export async function removeReview(req, res, next) {
  try {
    const review = await getReviewById(req.params.reviewId);

    if (!review) return next(notFoundErr("Review not found."));
    if (!canModifyReview(review, req.session.user)) return next(forbiddenErr());

    const vehicleId = review.vehicle_id;
    await deleteReview(req.params.reviewId);

    req.flash("info", "Review deleted.");
    res.redirect(vehicleId ? `/vehicle/${vehicleId}` : "/reviews");
  } catch (error) {
    next(error);
  }
}
