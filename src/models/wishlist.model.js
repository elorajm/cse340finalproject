import db from "./db.js";

export async function addToWishlist(userId, vehicleId) {
  await db.query(
    `INSERT INTO wishlists (user_id, vehicle_id) VALUES ($1, $2) ON CONFLICT (user_id, vehicle_id) DO NOTHING`,
    [userId, vehicleId]
  );
}

export async function removeFromWishlist(userId, vehicleId) {
  await db.query(
    `DELETE FROM wishlists WHERE user_id = $1 AND vehicle_id = $2`,
    [userId, vehicleId]
  );
}

export async function isVehicleWishlisted(userId, vehicleId) {
  const result = await db.query(
    `SELECT 1 FROM wishlists WHERE user_id = $1 AND vehicle_id = $2`,
    [userId, vehicleId]
  );
  return result.rows.length > 0;
}

export async function getWishlistByUser(userId) {
  const result = await db.query(
    `SELECT
       w.wishlist_id,
       w.created_at,
       v.vehicle_id,
       v.year,
       v.make,
       v.model,
       v.price,
       v.mileage,
       v.image_filename
     FROM wishlists w
     JOIN vehicles v ON v.vehicle_id = w.vehicle_id
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC`,
    [userId]
  );
  return result.rows.map(row => ({
    ...row,
    image_url: row.image_filename
      ? `/images/${row.image_filename}`
      : `/images/${row.year}${row.make.toLowerCase().replace(/\s+/g, "")}${row.model.toLowerCase().replace(/\s+/g, "")}.jpg`,
    alt_text: `${row.year} ${row.make} ${row.model}`
  }));
}
