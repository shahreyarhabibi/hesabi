import { NextResponse } from "next/server";
import { queryOne, checkOTPValidity } from "@/lib/db";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOTP = otp.trim();

    // Validate OTP format
    if (!/^\d{6}$/.test(normalizedOTP)) {
      return NextResponse.json(
        { error: "OTP must be 6 digits" },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await queryOne("SELECT id FROM users WHERE email = ?", [
      normalizedEmail,
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Use checkOTPValidity instead of verifyOTP (doesn't mark as used)
    const result = await checkOTPValidity(normalizedEmail, normalizedOTP);

    if (!result.valid) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
