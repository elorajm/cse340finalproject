import db from "./db.js";

export async function getAllVehicles() {
  const result = await db.query(`
    SELECT 
      v.*,
      c.name AS category,
      vi.image_url,
      vi.alt_text
    FROM vehicles v
    LEFT JOIN categories c
      ON v.category_id = c.category_id
    LEFT JOIN vehicle_images vi
      ON v.vehicle_id = vi.vehicle_id
      AND vi.is_primary = true
    ORDER BY v.created_at DESC
  `);

  return result.rows;
}

export async function getVehicleById(vehicleId) {
  const result = await db.query(
    `
    SELECT 
      v.*,
      c.name AS category,
      vi.image_url,
      vi.alt_text
    FROM vehicles v
    LEFT JOIN categories c
      ON v.category_id = c.category_id
    LEFT JOIN vehicle_images vi
      ON v.vehicle_id = vi.vehicle_id
      AND vi.is_primary = true
    WHERE v.vehicle_id = $1
  `,
    [vehicleId]
  );

  return result.rows[0];
}