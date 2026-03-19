import { getAllReviews } from "../models/review.model.js";

export function showAdminDashboard(req, res) {
  res.render("admin/dashboard", {
    title: "Admin Dashboard"
  });
}

export function showEmployeeDashboard(req, res) {
  res.render("admin/employee-dashboard", {
    title: "Employee Dashboard"
  });
}

export function showUserDashboard(req, res) {
  res.render("admin/user-dashboard", {
    title: "User Dashboard"
  });
}

export async function showReviewModeration(req, res, next) {
  try {
    const reviews = await getAllReviews();

    res.render("admin/reviews", {
      title: "Review Moderation",
      reviews
    });
  } catch (error) {
    next(error);
  }
}