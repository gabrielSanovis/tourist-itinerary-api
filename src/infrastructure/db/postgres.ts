import { Pool } from "pg";
import { logger } from "../../shared/logger/logger";
import { config } from "../../shared/config/config";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  host: config.PGHOST,
  port: config.PGPORT,
  user: config.PGUSER,
  password: config.PGPASSWORD,
  database: config.PGDATABASE,
});

pool.on("error", (err) => {
  logger.error({ err }, "Postgres pool error");
});

export async function initDb(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    logger.info("Postgres connection OK");
  } finally {
    client.release();
  }
}

export const db = {
  query: <T>(text: string, params?: unknown[]) => pool.query<T>(text, params),
};
