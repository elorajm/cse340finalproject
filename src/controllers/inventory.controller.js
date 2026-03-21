import { getAllVehicles, getVehicleById, getAllCategories } from "../models/inventory.model.js";
import { getReviewsByVehicleId, getUserVehicleReview } from "../models/review.model.js";
import { isVehicleWishlisted } from "../models/wishlist.model.js";

export async function showInventory(req, res, next) {
  try {
    const categoryId = req.query.category || "";
    const sort = req.query.sort || "newest";

    const vehicles = await getAllVehicles(categoryId || null, sort);
    const categories = await getAllCategories();

    res.render("catalog/inventory", {
      title: "Vehicle Inventory",
      vehicles,
      categories,
      selectedCategory: categoryId,
      selectedSort: sort
    });
  } catch (error) {
    next(error);
  }
}

export async function showVehicle(req, res, next) {
  try {
    const vehicleId = req.params.id;
    const vehicle = await getVehicleById(vehicleId);

    if (!vehicle) {
      const err = new Error("Vehicle not found.");
      err.status = 404;
      return next(err);
    }

    const reviews = await getReviewsByVehicleId(vehicleId);

    let userReview = null;
    let isWishlisted = false;
    if (req.session.user) {
      userReview = await getUserVehicleReview(req.session.user.user_id, vehicleId);
      try {
        isWishlisted = await isVehicleWishlisted(req.session.user.user_id, vehicleId);
      } catch (_) {
        // wishlists table may not exist yet
      }
    }

    res.render("catalog/vehicle", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehicle,
      reviews,
      userReview,
      isWishlisted,
      reviewError: req.query.reviewError || null,
      reviewFormErrors: null,
      reviewOld: null
    });
  } catch (error) {
    next(error);
  }
}
