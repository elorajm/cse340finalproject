import { getAllVehicles, getVehicleById } from "../models/inventory.model.js";

export async function showInventory(req, res, next) {
  try {
    const vehicles = await getAllVehicles();

    res.render("catalog/inventory", {
      title: "Vehicle Inventory",
      vehicles
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

    res.render("catalog/vehicle", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehicle
    });
  } catch (error) {
    next(error);
  }
}