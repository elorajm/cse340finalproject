import db from "./db.js";

export async function findUserByEmail(email) {
  const result = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
}

export async function createUser(firstName, lastName, email, passwordHash, role = "user") {
  const result = await db.query(
    `
      INSERT INTO users (first_name, last_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [firstName, lastName, email, passwordHash, role]
  );

  return result.rows[0];
}