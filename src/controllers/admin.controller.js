import { getAllReviews, getReviewsByUserId } from "../models/review.model.js";
import { getAllVehicles, getAllCategories } from "../models/inventory.model.js";
import { getAllUsers } from "../models/auth.model.js";
import { getAllRequests, getUserRequests } from "../models/service.model.js";
import { getAllContactMessages } from "../models/contact.model.js";
import { getUserPromotions } from "../models/promotion.model.js";
import { getWishlistByUser, getAllWishlists } from "../models/wishlist.model.js";

export async function showAdminDashboard(req, res, next) {
  try {
    // Run in small batches to avoid exhausting low DB connection limits.
    const [vehicles, categories] = await Promise.all([
      getAllVehicles(),
      getAllCategories()
    ]);
    const [users, serviceRequests] = await Promise.all([
      getAllUsers(),
      getAllRequests()
    ]);
    const [messages, reviews] = await Promise.all([
      getAllContactMessages(),
      getAllReviews()
    ]);

    let customerWishlists = [];
    try {
      customerWishlists = await getAllWishlists();
    } catch (_) {}

    const stats = {
      vehicles: vehicles.length,
      categories: categories.length,
      users: users.length,
      pendingServices: serviceRequests.filter(r => r.status === "Submitted").length,
      totalServices: serviceRequests.length,
      messages: messages.length,
      reviews: reviews.length
    };

    res.render("admin/dashboard", { title: "Owner Dashboard", stats, customerWishlists, allUsers: users });
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

    const [serviceRequests, reviews, promotions] = await Promise.all([
      getUserRequests(userId),
      getReviewsByUserId(userId),
      getUserPromotions(userId)
    ]);

    let wishlist = [];
    try {
      wishlist = await getWishlistByUser(userId);
    } catch (err) {
      console.error("Wishlist fetch error:", err.message);
    }

    res.render("admin/user-dashboard", {
      title: "Personal Dashboard",
      serviceRequests,
      reviews,
      promotions,
      wishlist
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
