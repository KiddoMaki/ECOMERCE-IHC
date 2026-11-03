import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000
    })
  : null;

pool?.on("error", (error) => {
  console.error("Idle database client error.", error.code || "database_error");
});

export async function query(text, values) {
  if (!pool) {
    const error = new Error("Database is not configured.");
    error.code = "DATABASE_NOT_CONFIGURED";
    throw error;
  }
  return pool.query(text, values);
}
