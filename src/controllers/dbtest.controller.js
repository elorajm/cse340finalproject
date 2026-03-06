import db from "../models/db.js";

export async function getDbTest(req, res, next) {
  try {
    const result = await db.query("SELECT NOW() AS current_time");
    res.json({
      success: true,
      databaseTime: result.rows[0].current_time
    });
  } catch (error) {
    next(error);
  }
}