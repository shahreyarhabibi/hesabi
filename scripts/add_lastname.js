// scripts/add-lastname-column.js
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function migrateDatabase() {
  const dbPath = path.join(__dirname, "../database.db");
  const db = new Database(dbPath);

  console.log("Starting last_name migration...\n");

  try {
    // Check if last_name column exists
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const hasLastNameColumn = tableInfo.some((col) => col.name === "last_name");

    if (!hasLastNameColumn) {
      console.log("Adding 'last_name' column to users table...");
      db.exec("ALTER TABLE users ADD COLUMN last_name TEXT");
      console.log("✓ last_name column added");
    } else {
      console.log("✓ last_name column already exists");
    }

    // Show current users
    const users = db
      .prepare("SELECT id, name, last_name, email FROM users")
      .all();
    console.log("\nCurrent users:");
    console.table(users);

    console.log("\n✓ Migration completed successfully!");
  } catch (error) {
    console.error("✗ Migration failed:", error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

migrateDatabase();
