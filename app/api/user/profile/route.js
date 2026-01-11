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
    const user = db
      .prepare(
        "SELECT id, email, name, avatar, created_at FROM users WHERE id = ?"
      )
      .get(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
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
    const { name, email, avatar } = body;

    const db = getDb();

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }

    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email);
    }

    if (avatar !== undefined) {
      updates.push("avatar = ?");
      values.push(avatar);
    }

    if (updates.length === 0) {
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
      .prepare("SELECT id, email, name, avatar FROM users WHERE id = ?")
      .get(session.user.id);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
