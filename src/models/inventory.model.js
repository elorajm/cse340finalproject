import db from "./db.js";

function buildImageName(vehicle) {
  const year = vehicle.year;
  const make = vehicle.make.toLowerCase().replace(/\s+/g, "");
  const model = vehicle.model.toLowerCase().replace(/\s+/g, "");
  return `/images/${year}${make}${model}.jpg`;
}

export async function getAllCategories() {
  const result = await db.query(`
    SELECT c.*, COUNT(v.vehicle_id)::int AS vehicle_count
    FROM categories c
    LEFT JOIN vehicles v ON v.category_id = c.category_id
    GROUP BY c.category_id
    ORDER BY c.name ASC
  `);
  return result.rows;
}

export async function getCategoryById(id) {
  const result = await db.query(
    `SELECT * FROM categories WHERE category_id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function createCategory(name) {
  const result = await db.query(
    `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return result.rows[0];
}

export async function updateCategory(id, name) {
  const result = await db.query(
    `UPDATE categories SET name = $1 WHERE category_id = $2 RETURNING *`,
    [name, id]
  );
  return result.rows[0];
}

export async function deleteCategory(id) {
  await db.query(`DELETE FROM categories WHERE category_id = $1`, [id]);
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

export async function createVehicle(year, make, model, price, mileage, description, categoryId) {
  const result = await db.query(
    `INSERT INTO vehicles (year, make, model, price, mileage, description, category_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [year, make, model, price, mileage, description, categoryId || null]
  );
  return result.rows[0];
}

export async function updateVehicle(vehicleId, year, make, model, price, mileage, description, categoryId) {
  const result = await db.query(
    `UPDATE vehicles
     SET year = $1, make = $2, model = $3, price = $4,
         mileage = $5, description = $6, category_id = $7
     WHERE vehicle_id = $8
     RETURNING *`,
    [year, make, model, price, mileage, description, categoryId || null, vehicleId]
  );
  return result.rows[0];
}

export async function deleteVehicle(vehicleId) {
  await db.query(`DELETE FROM vehicles WHERE vehicle_id = $1`, [vehicleId]);
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