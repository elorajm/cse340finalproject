import { getAllReviews } from "../models/review.model.js";
import { getAllVehicles, getAllCategories } from "../models/inventory.model.js";
import { getAllUsers } from "../models/auth.model.js";
import { getAllRequests } from "../models/service.model.js";
import { getAllContactMessages } from "../models/contact.model.js";

export async function showAdminDashboard(req, res, next) {
  try {
    const [vehicles, categories, users, serviceRequests, messages, reviews] = await Promise.all([
      getAllVehicles(),
      getAllCategories(),
      getAllUsers(),
      getAllRequests(),
      getAllContactMessages(),
      getAllReviews()
    ]);

    const stats = {
      vehicles: vehicles.length,
      categories: categories.length,
      users: users.length,
      pendingServices: serviceRequests.filter(r => r.status === "Submitted").length,
      totalServices: serviceRequests.length,
      messages: messages.length,
      reviews: reviews.length
    };

    res.render("admin/dashboard", { title: "Owner Dashboard", stats });
  } catch (error) {
    next(error);
  }
}

export function showEmployeeDashboard(req, res) {
  res.render("admin/employee-dashboard", {
    title: "Employee Dashboard"
  });
}

export function showUserDashboard(req, res) {
  res.render("admin/user-dashboard", {
    title: "My Dashboard"
  });
}

export async function showReviewModeration(req, res, next) {
  try {
    const reviews = await getAllReviews();
    res.render("admin/reviews", { title: "Review Moderation", reviews });
  } catch (error) {
    next(error);
  }
}
