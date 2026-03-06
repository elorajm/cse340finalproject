import db from "./db.js";

export async function getAllVehicles() {
  const result = await db.query(`
    SELECT v.*, c.name AS category
    FROM vehicles v
    LEFT JOIN categories c
    ON v.category_id = c.category_id
    ORDER BY v.created_at DESC
  `);

  return result.rows;
}

export async function getVehicleById(vehicleId) {
  const result = await db.query(
    `
    SELECT v.*, c.name AS category
    FROM vehicles v
    LEFT JOIN categories c
    ON v.category_id = c.category_id
    WHERE v.vehicle_id = $1
  `,
    [vehicleId]
  );

  return result.rows[0];
}