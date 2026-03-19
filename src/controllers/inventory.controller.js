import { getAllVehicles, getVehicleById, getAllCategories } from "../models/inventory.model.js";
import { getReviewsByVehicleId } from "../models/review.model.js";

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
      return res.status(404).send("Vehicle not found");
    }

    const reviews = await getReviewsByVehicleId(vehicleId);

    res.render("catalog/vehicle", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehicle,
      reviews
    });
  } catch (error) {
    next(error);
  }
}