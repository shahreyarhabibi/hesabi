import { NextResponse } from "next/server";
import { verifyOTP, queryOne, execute } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { email, otp, newPassword } = await request.json();

    // Validation
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOTP = otp.trim();

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(normalizedOTP)) {
      return NextResponse.json(
        { error: "OTP must be 6 digits" },
        { status: 400 },
      );
    }

    // ✅ Use verifyOTP here - this WILL mark it as used (consume it)
    const otpResult = await verifyOTP(normalizedEmail, normalizedOTP);

    if (!otpResult.valid) {
      return NextResponse.json({ error: otpResult.reason }, { status: 400 });
    }

    // Find user
    const user = await queryOne(
      "SELECT id, provider FROM users WHERE email = ?",
      [normalizedEmail],
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await execute("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      user.id,
    ]);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
