import { getAllVehicles, getVehicleById, getAllCategories } from "../models/inventory.model.js";
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

    let isWishlisted = false;
    if (req.session.user) {
      try {
        isWishlisted = await isVehicleWishlisted(req.session.user.user_id, vehicleId);
      } catch (_) {
        // wishlists table may not exist yet
      }
    }

    res.render("catalog/vehicle", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehicle,
      isWishlisted
    });
  } catch (error) {
    next(error);
  }
}
