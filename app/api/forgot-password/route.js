import { NextResponse } from "next/server";
import {
  createOTP,
  checkOTPRateLimit,
  incrementOTPRequestCount,
  queryOne,
} from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ✅ Check if user exists FIRST
    const user = await queryOne(
      "SELECT id, name, provider, password FROM users WHERE email = ?",
      [normalizedEmail],
    );

    // ✅ Return error if user doesn't exist
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 },
      );
    }

    // Check if user signed up with OAuth only (no password)
    if (!user.password && user.provider !== "credentials") {
      return NextResponse.json(
        {
          error: `This account uses ${user.provider} sign-in. Please sign in with ${user.provider}.`,
          provider: user.provider,
        },
        { status: 400 },
      );
    }

    // Check rate limit
    const rateLimit = await checkOTPRateLimit(normalizedEmail);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: rateLimit.blocked
            ? "Too many requests. Please try again in 1 hour."
            : `Please wait ${rateLimit.waitTime} seconds before requesting again.`,
          blocked: rateLimit.blocked || false,
          waitTime: rateLimit.waitTime,
        },
        { status: 429 },
      );
    }

    // Create OTP
    const otp = await createOTP(normalizedEmail);

    // Increment request count
    await incrementOTPRequestCount(normalizedEmail);

    // Send password reset email
    try {
      const result = await sendPasswordResetEmail(
        normalizedEmail,
        otp,
        user.name || "User",
      );

      if (!result.success) {
        console.error("Failed to send password reset email:", result.error);
        return NextResponse.json(
          { error: "Failed to send password reset email" },
          { status: 500 },
        );
      }
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset code sent to your email",
      expiresIn: 600,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
