// app/api/auth/signup/route.js
import { getDb } from "@/lib/db";
import { DEFAULT_AVATAR } from "@/lib/constants";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if user already exists
    const existingUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with default avatar
    const result = db
      .prepare(
        "INSERT INTO users (email, password, name, avatar) VALUES (?, ?, ?, ?)"
      )
      .run(email, hashedPassword, name || email.split("@")[0], DEFAULT_AVATAR);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: result.lastInsertRowid,
          email,
          name: name || email.split("@")[0],
          avatar: DEFAULT_AVATAR,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
