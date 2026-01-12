// scripts/migrate-db.js
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
    // Get current columns
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const existingColumns = tableInfo.map((col) => col.name);

    console.log("Current columns:", existingColumns);

    // Define all required columns
    const requiredColumns = [
      { name: "avatar", definition: "TEXT" },
      { name: "currency", definition: "TEXT DEFAULT 'USD'" },
      { name: "theme", definition: "TEXT DEFAULT 'light'" },
      { name: "updated_at", definition: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
    ];

    // Add missing columns
    for (const column of requiredColumns) {
      if (!existingColumns.includes(column.name)) {
        console.log(`Adding ${column.name} column...`);
        db.exec(
          `ALTER TABLE users ADD COLUMN ${column.name} ${column.definition}`
        );
        console.log(`✓ ${column.name} column added successfully`);
      } else {
        console.log(`✓ ${column.name} column already exists`);
      }
    }

    // Drop existing trigger if it exists (to recreate it cleanly)
    db.exec("DROP TRIGGER IF EXISTS update_user_timestamp");

    // Create trigger
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_user_timestamp 
      AFTER UPDATE ON users
      BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
    `);
    console.log("✓ Timestamp trigger created successfully");

    // Set default avatar for existing users who don't have one
    console.log("\nSetting default values for existing users...");

    const avatarResult = db
      .prepare(
        "UPDATE users SET avatar = ? WHERE avatar IS NULL OR avatar = ''"
      )
      .run(DEFAULT_AVATAR);
    console.log(
      `✓ Updated ${avatarResult.changes} user(s) with default avatar`
    );

    const currencyResult = db
      .prepare(
        "UPDATE users SET currency = 'USD' WHERE currency IS NULL OR currency = ''"
      )
      .run();
    console.log(
      `✓ Updated ${currencyResult.changes} user(s) with default currency`
    );

    const themeResult = db
      .prepare(
        "UPDATE users SET theme = 'light' WHERE theme IS NULL OR theme = ''"
      )
      .run();
    console.log(`✓ Updated ${themeResult.changes} user(s) with default theme`);

    // Show final table structure
    const finalTableInfo = db.prepare("PRAGMA table_info(users)").all();
    console.log("\n📊 Final table structure:");
    finalTableInfo.forEach((col) => {
      console.log(
        `   ${col.name}: ${col.type} ${
          col.dflt_value ? `(default: ${col.dflt_value})` : ""
        }`
      );
    });

    // Show summary
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get();
    console.log(`\n   Total users: ${totalUsers.count}`);

    console.log("\n✓ Database migration completed successfully!");
  } catch (error) {
    console.error("✗ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    db.close();
  }
}

migrateDatabase();
