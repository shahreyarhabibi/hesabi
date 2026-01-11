// scripts/migrate-db.js
// Run this script once to update existing database: node scripts/migrate-db.js

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_AVATAR = "/avatars/user.png";

function migrateDatabase() {
  const dbPath = path.join(__dirname, "../database.db");
  const db = new Database(dbPath);

  console.log("Starting database migration...");

  try {
    // Check if avatar column exists
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const hasAvatarColumn = tableInfo.some((col) => col.name === "avatar");

    if (!hasAvatarColumn) {
      console.log("Adding avatar column to users table...");
      db.exec("ALTER TABLE users ADD COLUMN avatar TEXT");
      console.log("✓ Avatar column added successfully");
    } else {
      console.log("✓ Avatar column already exists");
    }

    // Check if updated_at column exists
    const hasUpdatedAtColumn = tableInfo.some(
      (col) => col.name === "updated_at"
    );

    if (!hasUpdatedAtColumn) {
      console.log("Adding updated_at column to users table...");
      db.exec(
        "ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP"
      );
      console.log("✓ updated_at column added successfully");

      // Create trigger
      db.exec(`
        CREATE TRIGGER IF NOT EXISTS update_user_timestamp 
        AFTER UPDATE ON users
        BEGIN
          UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
      `);
      console.log("✓ Timestamp trigger created successfully");
    } else {
      console.log("✓ updated_at column already exists");
    }

    // Set default avatar for existing users who don't have one
    console.log("\nSetting default avatar for existing users...");
    const result = db
      .prepare(
        "UPDATE users SET avatar = ? WHERE avatar IS NULL OR avatar = ''"
      )
      .run(DEFAULT_AVATAR);

    console.log(`✓ Updated ${result.changes} user(s) with default avatar`);

    // Show summary
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get();
    const usersWithDefault = db
      .prepare("SELECT COUNT(*) as count FROM users WHERE avatar = ?")
      .get(DEFAULT_AVATAR);
    const usersWithCustom = db
      .prepare(
        "SELECT COUNT(*) as count FROM users WHERE avatar != ? AND avatar IS NOT NULL"
      )
      .get(DEFAULT_AVATAR);

    console.log("\n📊 Avatar Summary:");
    console.log(`   Total users: ${totalUsers.count}`);
    console.log(`   Using default avatar: ${usersWithDefault.count}`);
    console.log(`   Using custom avatar: ${usersWithCustom.count}`);

    console.log("\n✓ Database migration completed successfully!");
  } catch (error) {
    console.error("✗ Migration failed:", error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

migrateDatabase();
