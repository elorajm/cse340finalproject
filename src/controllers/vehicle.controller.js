import {
  getAllVehicles,
  getAllCategories,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from "../models/inventory.model.js";

export async function showVehicleList(req, res, next) {
  try {
    const vehicles = await getAllVehicles();
    res.render("admin/vehicles", {
      title: "Manage Vehicles",
      vehicles
    });
  } catch (error) {
    next(error);
  }
}

export async function showAddVehicleForm(req, res, next) {
  try {
    const categories = await getAllCategories();
    res.render("admin/vehicle-form", {
      title: "Add Vehicle",
      vehicle: null,
      categories,
      errors: [],
      old: {}
    });
  } catch (error) {
    next(error);
  }
}

export async function addVehicle(req, res, next) {
  try {
    const { year, make, model, price, mileage, description, category_id, image_filename } = req.body;

    if (!year || !make || !model || !price) {
      const categories = await getAllCategories();
      return res.status(400).render("admin/vehicle-form", {
        title: "Add Vehicle",
        vehicle: null,
        categories,
        errors: [{ msg: "Year, make, model, and price are required." }],
        old: req.body
      });
    }

    await createVehicle(year, make, model, price, mileage, description, category_id, image_filename || null);
    req.flash("success", `${year} ${make} ${model} added to inventory.`);
    res.redirect("/admin/vehicles");
  } catch (error) {
    next(error);
  }
}

export async function showEditVehicleForm(req, res, next) {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) {
      const err = new Error("Vehicle not found.");
      err.status = 404;
      return next(err);
    }

    const categories = await getAllCategories();
    res.render("admin/vehicle-form", {
      title: "Edit Vehicle",
      vehicle,
      categories,
      errors: [],
      old: vehicle
    });
  } catch (error) {
    next(error);
  }
}

export async function editVehicle(req, res, next) {
  try {
    const { year, make, model, price, mileage, description, category_id, image_filename } = req.body;

    if (!year || !make || !model || !price) {
      const categories = await getAllCategories();
      const vehicle = await getVehicleById(req.params.id);
      return res.status(400).render("admin/vehicle-form", {
        title: "Edit Vehicle",
        vehicle,
        categories,
        errors: [{ msg: "Year, make, model, and price are required." }],
        old: req.body
      });
    }

    const existingVehicle = await getVehicleById(req.params.id);
    if (!existingVehicle) {
      const err = new Error("Vehicle not found.");
      err.status = 404;
      return next(err);
    }

    await updateVehicle(req.params.id, year, make, model, price, mileage, description, category_id, image_filename || null);
    req.flash("success", "Vehicle updated successfully.");
    res.redirect("/admin/vehicles");
  } catch (error) {
    next(error);
  }
}

export async function removeVehicle(req, res, next) {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) {
      const err = new Error("Vehicle not found.");
      err.status = 404;
      return next(err);
    }

    await deleteVehicle(req.params.id);
    req.flash("info", "Vehicle removed from inventory.");
    res.redirect("/admin/vehicles");
  } catch (error) {
    next(error);
  }
}
