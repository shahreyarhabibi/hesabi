// scripts/migrate-oauth.js
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function migrateDatabase() {
  const dbPath = path.join(__dirname, "../database.db");
  const db = new Database(dbPath);

  console.log("Starting OAuth migration...\n");

  try {
    // Check if provider column exists in users table
    const userTableInfo = db.prepare("PRAGMA table_info(users)").all();
    const hasProviderColumn = userTableInfo.some(
      (col) => col.name === "provider"
    );

    if (!hasProviderColumn) {
      console.log("Adding provider column to users table...");
      db.exec(
        "ALTER TABLE users ADD COLUMN provider TEXT DEFAULT 'credentials'"
      );
      console.log("✓ Provider column added");
    } else {
      console.log("✓ Provider column already exists");
    }

    // Check if provider_id column exists
    const hasProviderIdColumn = userTableInfo.some(
      (col) => col.name === "provider_id"
    );

    if (!hasProviderIdColumn) {
      console.log("Adding provider_id column to users table...");
      db.exec("ALTER TABLE users ADD COLUMN provider_id TEXT");
      console.log("✓ Provider_id column added");
    } else {
      console.log("✓ Provider_id column already exists");
    }

    // Check if accounts table exists
    const accountsTableExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'"
      )
      .get();

    if (!accountsTableExists) {
      console.log("Creating accounts table...");
      db.exec(`
        CREATE TABLE accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          provider TEXT NOT NULL,
          provider_account_id TEXT NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at INTEGER,
          token_type TEXT,
          scope TEXT,
          id_token TEXT,
          session_state TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE(provider, provider_account_id)
        )
      `);
      console.log("✓ Accounts table created");
    } else {
      console.log("✓ Accounts table already exists");
    }

    // Update existing users to have 'credentials' as provider
    const result = db
      .prepare(
        "UPDATE users SET provider = 'credentials' WHERE provider IS NULL"
      )
      .run();
    console.log(
      `✓ Updated ${result.changes} existing users with 'credentials' provider`
    );

    console.log("\n✓ OAuth migration completed successfully!");
  } catch (error) {
    console.error("✗ Migration failed:", error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

migrateDatabase();
