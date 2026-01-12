// app/api/user/profile/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("GET /api/user/profile - Session:", session);

    if (!session?.user?.id) {
      console.log("GET /api/user/profile - No session or user id");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // First, let's check what columns exist in the users table
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    console.log(
      "Users table columns:",
      tableInfo.map((col) => col.name)
    );

    // Build query based on existing columns
    const columns = tableInfo.map((col) => col.name);
    const hasColumn = (name) => columns.includes(name);

    let selectColumns = ["id", "email", "name", "avatar"];
    if (hasColumn("currency")) selectColumns.push("currency");
    if (hasColumn("theme")) selectColumns.push("theme");
    if (hasColumn("created_at")) selectColumns.push("created_at");

    const query = `SELECT ${selectColumns.join(", ")} FROM users WHERE id = ?`;
    console.log("Query:", query);

    const user = db.prepare(query).get(session.user.id);
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse name into firstName and lastName
    const nameParts = (user.name || "").split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    return NextResponse.json({
      user: {
        ...user,
        firstName,
        lastName,
        currency: user.currency || "USD",
        theme: user.theme || "light",
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("PATCH /api/user/profile - Session:", session);

    if (!session?.user?.id) {
      console.log("PATCH /api/user/profile - No session or user id");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("PATCH /api/user/profile - Body:", body);

    const { firstName, lastName, email, avatar, currency, theme } = body;

    const db = getDb();

    // Check what columns exist
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const columns = tableInfo.map((col) => col.name);
    const hasColumn = (name) => columns.includes(name);

    console.log("Available columns:", columns);

    // Build dynamic update query
    const updates = [];
    const values = [];

    // Combine firstName and lastName into name
    if (firstName !== undefined || lastName !== undefined) {
      const currentUser = db
        .prepare("SELECT name FROM users WHERE id = ?")
        .get(session.user.id);

      const currentNameParts = (currentUser?.name || "").split(" ");
      const newFirstName =
        firstName !== undefined ? firstName : currentNameParts[0] || "";
      const newLastName =
        lastName !== undefined
          ? lastName
          : currentNameParts.slice(1).join(" ") || "";

      const fullName = `${newFirstName} ${newLastName}`.trim();
      updates.push("name = ?");
      values.push(fullName);
    }

    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = db
        .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
        .get(email, session.user.id);

      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }

      updates.push("email = ?");
      values.push(email);
    }

    if (avatar !== undefined && hasColumn("avatar")) {
      updates.push("avatar = ?");
      values.push(avatar);
    }

    if (currency !== undefined && hasColumn("currency")) {
      updates.push("currency = ?");
      values.push(currency);
    }

    if (theme !== undefined && hasColumn("theme")) {
      updates.push("theme = ?");
      values.push(theme);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(session.user.id);

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    console.log("Update query:", query);
    console.log("Update values:", values);

    db.prepare(query).run(...values);

    // Fetch updated user - build query based on available columns
    let selectColumns = ["id", "email", "name"];
    if (hasColumn("avatar")) selectColumns.push("avatar");
    if (hasColumn("currency")) selectColumns.push("currency");
    if (hasColumn("theme")) selectColumns.push("theme");

    const selectQuery = `SELECT ${selectColumns.join(
      ", "
    )} FROM users WHERE id = ?`;
    const updatedUser = db.prepare(selectQuery).get(session.user.id);

    console.log("Updated user:", updatedUser);

    // Parse name into firstName and lastName for response
    const nameParts = (updatedUser.name || "").split(" ");

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        currency: updatedUser.currency || "USD",
        theme: updatedUser.theme || "light",
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
