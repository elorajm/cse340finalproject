import { getAllReviews, getReviewsByUserId } from "../models/review.model.js";
import { getAllVehicles, getAllCategories } from "../models/inventory.model.js";
import { getAllUsers } from "../models/auth.model.js";
import { getAllRequests, getUserRequests } from "../models/service.model.js";
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

export async function showEmployeeDashboard(req, res, next) {
  try {
    const [serviceRequests, messages, reviews] = await Promise.all([
      getAllRequests(),
      getAllContactMessages(),
      getAllReviews()
    ]);

    const stats = {
      pendingServices: serviceRequests.filter(r => r.status === "Submitted").length,
      inProgressServices: serviceRequests.filter(r => r.status === "In Progress").length,
      totalServices: serviceRequests.length,
      messages: messages.length,
      reviews: reviews.length
    };

    res.render("admin/employee-dashboard", { title: "Employee Dashboard", stats });
  } catch (error) {
    next(error);
  }
}

export async function showUserDashboard(req, res, next) {
  try {
    const userId = req.session.user.user_id;
    const [serviceRequests, reviews] = await Promise.all([
      getUserRequests(userId),
      getReviewsByUserId(userId)
    ]);
    res.render("admin/user-dashboard", {
      title: "My Dashboard",
      serviceRequests,
      reviews
    });
  } catch (error) {
    next(error);
  }
}

export async function showReviewModeration(req, res, next) {
  try {
    const reviews = await getAllReviews();
    res.render("admin/reviews", { title: "Review Moderation", reviews });
  } catch (error) {
    next(error);
  }
}
