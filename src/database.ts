import { Pool } from "pg";
import config from "./config";

const pool = new Pool({
  user: config.database.DB_USER,
  host: config.database.DB_HOST,
  database: config.database.DB_NAME,
  password: config.database.DB_PASSWORD,
  port: config.database.DB_PORT,
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
