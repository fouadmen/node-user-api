import pool from "./database";
import path from "path";
import fs from "fs";

//Execute all migrations
async function runMigrations() {
  const client = await pool.connect();
  try {
    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs.readdirSync(migrationsDir).sort();

    for (const migrationFile of migrationFiles) {
      const filePath = path.join(migrationsDir, migrationFile);
      const migrationSql = fs.readFileSync(filePath, "utf8");

      await client.query(migrationSql);
      console.log(`Applied migration: ${migrationFile}`);
    }

    client.release();
    console.log("All migrations completed.");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    client.release();
  }
}

runMigrations();
