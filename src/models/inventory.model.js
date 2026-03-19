import db from "./db.js";

function buildImageName(vehicle) {
  const year = vehicle.year;
  const make = vehicle.make.toLowerCase().replace(/\s+/g, "");
  const model = vehicle.model.toLowerCase().replace(/\s+/g, "");
  return `/images/${year}${make}${model}.jpg`;
}

export async function getAllVehicles() {
  const result = await db.query(`
    SELECT 
      v.*,
      c.name AS category
    FROM vehicles v
    LEFT JOIN categories c
      ON v.category_id = c.category_id
    ORDER BY v.created_at DESC
  `);

  const vehicles = result.rows.map(vehicle => ({
    ...vehicle,
    image_url: buildImageName(vehicle),
    alt_text: `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  }));

  return vehicles;
}

export async function getVehicleById(vehicleId) {
  const result = await db.query(
    `
    SELECT 
      v.*,
      c.name AS category
    FROM vehicles v
    LEFT JOIN categories c
      ON v.category_id = c.category_id
    WHERE v.vehicle_id = $1
  `,
    [vehicleId]
  );

  if (!result.rows[0]) return null;

  const vehicle = result.rows[0];

  return {
    ...vehicle,
    image_url: buildImageName(vehicle),
    alt_text: `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  };
}