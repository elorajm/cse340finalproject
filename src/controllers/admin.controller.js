import { getAllReviews, getReviewsByUserId } from "../models/review.model.js";
import { getAllVehicles, getAllCategories } from "../models/inventory.model.js";
import { getAllUsers } from "../models/auth.model.js";
import { getAllRequests, getUserRequests } from "../models/service.model.js";
import { getAllContactMessages } from "../models/contact.model.js";
import { getUserPromotions } from "../models/promotion.model.js";

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
    const { role, user_id: userId } = req.session.user;

    // Employees have their own dashboard; redirect them there
    if (role === "employee") {
      return res.redirect("/admin/employee");
    }

    const fetchAll = role === "owner"
      ? Promise.all([getUserRequests(userId), getReviewsByUserId(userId), getUserPromotions(userId), getAllUsers()])
      : Promise.all([getUserRequests(userId), getReviewsByUserId(userId), getUserPromotions(userId)]);

    const result = await fetchAll;
    const [serviceRequests, reviews, promotions, allUsers = null] = result;

    res.render("admin/user-dashboard", {
      title: "User Dashboard",
      serviceRequests,
      reviews,
      promotions,
      allUsers
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
