import db from "./db.js";

export async function createServiceRequest(userId, carYear, carMake, carModel, serviceType, description) {
  const result = await db.query(
    `
      INSERT INTO service_requests (user_id, car_year, car_make, car_model, service_type, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [userId, carYear || null, carMake || null, carModel || null, serviceType, description]
  );

  return result.rows[0];
}

export async function getUserRequests(userId) {
  const result = await db.query(
    `
      SELECT *
      FROM service_requests
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

export async function getAllRequests() {
  const result = await db.query(
    `
      SELECT sr.*, u.first_name, u.last_name
      FROM service_requests sr
      JOIN users u ON sr.user_id = u.user_id
      ORDER BY sr.created_at DESC
    `
  );

  return result.rows;
}

export async function getServiceRequestById(requestId) {
  const result = await db.query(
    `SELECT * FROM service_requests WHERE request_id = $1`,
    [requestId]
  );
  return result.rows[0] || null;
}

export async function updateRequestStatus(requestId, status, notes) {
  const result = await db.query(
    `
      UPDATE service_requests
      SET status = $1,
          notes = $2,
          updated_at = NOW()
      WHERE request_id = $3
      RETURNING *
    `,
    [status, notes, requestId]
  );

  return result.rows[0];
}