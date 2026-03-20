import db from "./db.js";

export async function getReviewsByVehicleId(vehicleId) {
  const result = await db.query(
    `
      SELECT r.*, u.first_name, u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.vehicle_id = $1
      ORDER BY r.created_at DESC
    `,
    [vehicleId]
  );

  return result.rows;
}

export async function getReviewById(reviewId) {
  const result = await db.query(
    `
      SELECT *
      FROM reviews
      WHERE review_id = $1
    `,
    [reviewId]
  );

  return result.rows[0];
}

export async function createReview(vehicleId, userId, rating, comment) {
  const result = await db.query(
    `
      INSERT INTO reviews (vehicle_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [vehicleId, userId, rating, comment]
  );

  return result.rows[0];
}

export async function updateReview(reviewId, rating, comment) {
  const result = await db.query(
    `
      UPDATE reviews
      SET rating = $1,
          comment = $2,
          updated_at = NOW()
      WHERE review_id = $3
      RETURNING *
    `,
    [rating, comment, reviewId]
  );

  return result.rows[0];
}

export async function deleteReview(reviewId) {
  await db.query(
    `
      DELETE FROM reviews
      WHERE review_id = $1
    `,
    [reviewId]
  );
}
export async function getUserVehicleReview(userId, vehicleId) {
  const result = await db.query(
    `SELECT * FROM reviews WHERE user_id = $1 AND vehicle_id = $2`,
    [userId, vehicleId]
  );
  return result.rows[0] || null;
}

export async function getReviewsByUserId(userId) {
  const result = await db.query(
    `
      SELECT r.*, v.year, v.make, v.model, v.vehicle_id
      FROM reviews r
      JOIN vehicles v ON r.vehicle_id = v.vehicle_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `,
    [userId]
  );
  return result.rows;
}

export async function getAllReviews() {
  const result = await db.query(`
    SELECT 
      r.*,
      u.first_name,
      u.last_name,
      v.year,
      v.make,
      v.model
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    JOIN vehicles v ON r.vehicle_id = v.vehicle_id
    ORDER BY r.created_at DESC
  `);

  return result.rows;
}