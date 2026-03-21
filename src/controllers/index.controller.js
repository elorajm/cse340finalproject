import { getAllVehicles } from "../models/inventory.model.js";

export async function getHome(req, res, next) {
  try {
    const all = await getAllVehicles(null, "newest");
    const featured = all.slice(0, 3);

    // Pick a random vehicle image for the hero on each page load
    const heroVehicle = all.length > 0
      ? all[Math.floor(Math.random() * all.length)]
      : null;

    res.render("index", {
      title: "Home",
      bodyClass: "home-page",
      featured,
      heroVehicle
    });
  } catch (error) {
    next(error);
  }
}
