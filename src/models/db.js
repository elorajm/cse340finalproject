import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

function parsePoolMax(value, fallback = 5) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const pool = new Pool({
  connectionString: process.env.DB_URL,
  // Keep defaults conservative for hosted DB plans with low connection limits.
  max: parsePoolMax(process.env.DB_POOL_MAX, 5),
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;