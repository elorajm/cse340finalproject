import db from "./db.js";

function buildImageName(vehicle) {
  const year = vehicle.year;
  const make = vehicle.make.toLowerCase().replace(/\s+/g, "");
  const model = vehicle.model.toLowerCase().replace(/\s+/g, "");
  return `/images/${year}${make}${model}.jpg`;
}

export async function getAllCategories() {
  const result = await db.query(`
    SELECT *
    FROM categories
    ORDER BY name ASC
  `);

  return result.rows;
}

export async function getAllVehicles(categoryId = null, sort = "newest") {
  let query = `
    SELECT 
      v.*,
      c.name AS category
    FROM vehicles v
    LEFT JOIN categories c
      ON v.category_id = c.category_id
  `;

  const values = [];

  if (categoryId) {
    query += ` WHERE v.category_id = $1 `;
    values.push(categoryId);
  }

  switch (sort) {
    case "price_asc":
      query += ` ORDER BY v.price ASC `;
      break;
    case "price_desc":
      query += ` ORDER BY v.price DESC `;
      break;
    case "year_desc":
      query += ` ORDER BY v.year DESC `;
      break;
    case "year_asc":
      query += ` ORDER BY v.year ASC `;
      break;
    case "mileage_asc":
      query += ` ORDER BY v.mileage ASC `;
      break;
    case "mileage_desc":
      query += ` ORDER BY v.mileage DESC `;
      break;
    default:
      query += ` ORDER BY v.created_at DESC `;
  }

  const result = await db.query(query, values);

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