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

export async function getDbInfo(req, res, next) {
  try {
    const result = await db.query(
      "SELECT current_database(), current_user, current_schema()"
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}