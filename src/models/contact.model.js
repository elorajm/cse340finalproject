import db from "./db.js";

export async function createContactMessage(name, email, subject, message) {
  const result = await db.query(
    `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [name, email, subject, message]
  );

  return result.rows[0];
}

export async function getAllContactMessages() {
  const result = await db.query(
    `
      SELECT *
      FROM contact_messages
      ORDER BY created_at DESC
    `
  );

  return result.rows;
}