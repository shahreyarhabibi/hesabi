// scripts/fix-password-nullable.js
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function migrateDatabase() {
  const dbPath = path.join(__dirname, "../database.db");
  const db = new Database(dbPath);

  console.log("Starting password nullable migration...\n");

  try {
    // Start transaction
    db.exec("BEGIN TRANSACTION");

    // 1. Create new table with nullable password
    console.log("Creating new users table with nullable password...");
    db.exec(`
      CREATE TABLE users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        name TEXT,
        avatar TEXT,
        provider TEXT DEFAULT 'credentials',
        provider_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ New table created");

    // 2. Copy data from old table
    console.log("Copying data from old table...");
    db.exec(`
      INSERT INTO users_new (id, email, password, name, avatar, provider, provider_id, created_at, updated_at)
      SELECT id, email, password, name, avatar, 
             COALESCE(provider, 'credentials'), 
             provider_id, 
             created_at, 
             COALESCE(updated_at, created_at)
      FROM users
    `);

    const count = db.prepare("SELECT COUNT(*) as count FROM users_new").get();
    console.log(`✓ Copied ${count.count} users`);

    // 3. Drop old table
    console.log("Dropping old users table...");
    db.exec("DROP TABLE users");
    console.log("✓ Old table dropped");

    // 4. Rename new table
    console.log("Renaming new table to users...");
    db.exec("ALTER TABLE users_new RENAME TO users");
    console.log("✓ Table renamed");

    // Commit transaction
    db.exec("COMMIT");

    // Verify
    console.log("\nVerifying new table structure:");
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    tableInfo.forEach((col) => {
      const nullable = col.notnull === 0 ? "NULL" : "NOT NULL";
      console.log(`  - ${col.name}: ${nullable}`);
    });

    console.log("\n✓ Migration completed successfully!");
    console.log(
      "Password column is now nullable - OAuth users can be created!"
    );
  } catch (error) {
    // Rollback on error
    db.exec("ROLLBACK");
    console.error("✗ Migration failed:", error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

migrateDatabase();
