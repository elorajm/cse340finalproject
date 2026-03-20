import { getAllVehicles } from "../models/inventory.model.js";

export async function getHome(req, res, next) {
  try {
    const all = await getAllVehicles(null, "newest");
    const featured = all.slice(0, 3);

    res.render("index", {
      title: "Home",
      bodyClass: "home-page",
      featured
    });
  } catch (error) {
    next(error);
  }
}
