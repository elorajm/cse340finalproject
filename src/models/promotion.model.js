import db from "./db.js";

export async function createPromotion(title, message, discountCode, expiresAt, createdBy) {
  const result = await db.query(
    `INSERT INTO promotions (title, message, discount_code, expires_at, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, message, discountCode || null, expiresAt || null, createdBy]
  );
  return result.rows[0];
}

export async function getAllPromotions() {
  const result = await db.query(
    `SELECT p.*,
            u.first_name AS sender_first, u.last_name AS sender_last,
            COUNT(up.id) AS recipient_count
     FROM promotions p
     LEFT JOIN users u ON u.user_id = p.created_by
     LEFT JOIN user_promotions up ON up.promotion_id = p.promotion_id
     GROUP BY p.promotion_id, u.first_name, u.last_name
     ORDER BY p.created_at DESC`
  );
  return result.rows;
}

export async function sendPromotionToUsers(promotionId, userIds) {
  if (!userIds.length) return;
  const values = userIds.map((uid, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(", ");
  const params = userIds.flatMap(uid => [uid, promotionId]);
  await db.query(
    `INSERT INTO user_promotions (user_id, promotion_id)
     VALUES ${values}
     ON CONFLICT (user_id, promotion_id) DO NOTHING`,
    params
  );
}

export async function getUserPromotions(userId) {
  const result = await db.query(
    `SELECT p.promotion_id, p.title, p.message, p.discount_code, p.expires_at, p.created_at,
            up.is_read, up.received_at
     FROM user_promotions up
     JOIN promotions p ON p.promotion_id = up.promotion_id
     WHERE up.user_id = $1
     ORDER BY up.received_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function markPromotionRead(userId, promotionId) {
  await db.query(
    `UPDATE user_promotions SET is_read = TRUE
     WHERE user_id = $1 AND promotion_id = $2`,
    [userId, promotionId]
  );
}
