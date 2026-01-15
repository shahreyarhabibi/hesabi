// app/api/user/profile/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// GET - Fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // Fetch user with all relevant columns
    const user = db
      .prepare(
        `SELECT 
          id, email, name, last_name, avatar, currency, theme, created_at 
        FROM users 
        WHERE id = ?`
      )
      .get(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use 'name' as firstName, 'last_name' as lastName
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.name || "",
        lastName: user.last_name || "",
        avatar: user.avatar || "/avatars/user.png",
        currency: user.currency || "USD",
        theme: user.theme || "light",
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, avatar, currency, theme } = body;

    const db = getDb();

    // Build dynamic update query
    const updates = [];
    const values = [];

    // Update firstName (stored in 'name' column)
    if (firstName !== undefined) {
      updates.push("name = ?");
      values.push(firstName.trim());
    }

    // Update lastName (stored in 'last_name' column)
    if (lastName !== undefined) {
      updates.push("last_name = ?");
      values.push(lastName.trim());
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

    if (avatar !== undefined) {
      updates.push("avatar = ?");
      values.push(avatar);
    }

    if (currency !== undefined) {
      updates.push("currency = ?");
      values.push(currency);
    }

    if (theme !== undefined) {
      updates.push("theme = ?");
      values.push(theme);
    }

    // Add updated_at
    updates.push("updated_at = CURRENT_TIMESTAMP");

    if (updates.length === 1) {
      // Only updated_at, no actual changes
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(session.user.id);

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    // Fetch updated user
    const updatedUser = db
      .prepare(
        `SELECT id, email, name, last_name, avatar, currency, theme 
         FROM users WHERE id = ?`
      )
      .get(session.user.id);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.name || "",
        lastName: updatedUser.last_name || "",
        avatar: updatedUser.avatar || "/avatars/user.png",
        currency: updatedUser.currency || "USD",
        theme: updatedUser.theme || "light",
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
