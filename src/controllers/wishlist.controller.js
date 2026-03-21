import {
  addToWishlist,
  removeFromWishlist,
  isVehicleWishlisted
} from "../models/wishlist.model.js";

export async function toggleWishlist(req, res, next) {
  try {
    const userId = req.session.user.user_id;
    const vehicleId = parseInt(req.params.id, 10);

    const wishlisted = await isVehicleWishlisted(userId, vehicleId);

    if (wishlisted) {
      await removeFromWishlist(userId, vehicleId);
    } else {
      await addToWishlist(userId, vehicleId);
    }

    res.redirect(`/vehicle/${vehicleId}`);
  } catch (error) {
    console.error("Wishlist toggle error:", error.message);
    next(error);
  }
}
