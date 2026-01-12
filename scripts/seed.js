// scripts/migrate-db.js
// Run once: node scripts/migrate-db.js

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function migrateDatabase() {
  const dbPath = path.join(__dirname, "../database.db");
  const db = new Database(dbPath);

  console.log("Starting database migration...");

  try {
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();

    /* =======================
       Theme column
    ======================= */
    const hasThemeColumn = tableInfo.some((col) => col.name === "theme");

    if (!hasThemeColumn) {
      console.log("Adding theme column...");
      db.exec("ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'light'");
      console.log("✓ Theme column added");
    } else {
      console.log("✓ Theme column already exists");
    }

    /* =======================
       updated_at column
    ======================= */
    const hasUpdatedAtColumn = tableInfo.some(
      (col) => col.name === "updated_at"
    );

    if (!hasUpdatedAtColumn) {
      console.log("Adding updated_at column...");
      db.exec("ALTER TABLE users ADD COLUMN updated_at DATETIME");

      // Backfill existing rows
      db.exec(`
        UPDATE users
        SET updated_at = CURRENT_TIMESTAMP
        WHERE updated_at IS NULL;
      `);

      // Trigger for future updates
      db.exec(`
        CREATE TRIGGER IF NOT EXISTS update_user_timestamp
        AFTER UPDATE ON users
        BEGIN
          UPDATE users
          SET updated_at = CURRENT_TIMESTAMP
          WHERE id = NEW.id;
        END;
      `);

      console.log("✓ updated_at column + trigger created");
    } else {
      console.log("✓ updated_at column already exists");
    }

    console.log("\n✓ Database migration completed successfully!");
  } catch (error) {
    console.error("✗ Migration failed:", error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

migrateDatabase();
