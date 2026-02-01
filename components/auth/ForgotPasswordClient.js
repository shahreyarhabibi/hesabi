"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiMail, FiArrowLeft, FiCheck, FiAlertCircle } from "react-icons/fi";
import PasswordInput from "./PasswordInput";
import OTPModal from "./OTPModal";
import darkLogo from "@/public/dark-logo.png";
import lightLogo from "@/public/light-logo.png";

export default function ForgotPasswordClient() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const isDarkMode = htmlElement.classList.contains("dark");
      const dataTheme = htmlElement.getAttribute("data-theme");
      setIsDark(isDarkMode || dataTheme === "dark");
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const logoSrc = isDark ? darkLogo : lightLogo;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      setShowOTPModal(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Verify OTP with API before proceeding
  const handleVerifyOTP = async (otp) => {
    try {
      const response = await fetch("/api/verify-reset-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // ✅ Throw error so OTPModal can display it
        throw new Error(data.error || "Invalid OTP");
      }

      // ✅ Only proceed if OTP is valid
      setVerifiedOtp(otp);
      setShowOTPModal(false);
      setStep(3);
    } catch (err) {
      // ✅ Re-throw the error so OTPModal shows it
      throw err;
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.error || "Failed to resend OTP");
        error.response = { data };
        throw error;
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: verifiedOtp,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("OTP") || data.error?.includes("expired")) {
          setError(data.error + " Please request a new code.");
          setStep(1);
          setVerifiedOtp("");
          return;
        }
        throw new Error(data.error || "Failed to reset password");
      }

      setStep(4);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 rounded-2xl w-full max-w-md h-96" />
      </div>
    );
  }

  return (
    <>
      <section className="flex bg-[#2A5BC0] md:bg-[#7596D8]">
        <div className="relative flex w-full min-h-screen items-center bg-background justify-center md:rounded-none rounded-bl-[20vw] rounded-tr-[20vw]">
          <div className="flex w-3/4 min-h-screen flex-col items-center justify-center gap-5">
            <div className="flex flex-col md:items-start items-center gap-2 w-full max-w-md">
              <Image
                className="mb-5"
                alt="Hesabi Logo"
                width={160}
                height={50}
                src={logoSrc}
                priority
              />

              {/* Step 1: Email Input */}
              {step === 1 && (
                <>
                  <h2 className="md:block hidden text-3xl font-bold text-foreground">
                    Forgot Password?
                  </h2>
                  <p className="text-text text-center md:text-left mb-4">
                    No worries! Enter your email and we'll send you a reset
                    code.
                  </p>

                  <form
                    onSubmit={handleSendOTP}
                    className="flex flex-col gap-5 mt-4 w-full"
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="email"
                        className="font-semibold text-foreground"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full rounded-md border border-gray-300 p-3 pl-10 focus:outline-primary/70"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <FiAlertCircle />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer bg-primary p-3 rounded-md text-md font-semibold text-background hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                  </form>
                </>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <>
                  <h2 className="md:block hidden text-3xl font-bold text-foreground">
                    Create New Password
                  </h2>
                  <p className="text-text text-center md:text-left mb-4">
                    Enter your new password below.
                  </p>

                  <form
                    onSubmit={handleResetPassword}
                    className="flex flex-col gap-5 mt-4 w-full"
                  >
                    <PasswordInput
                      id="newPassword"
                      name="newPassword"
                      placeholder="Enter new password"
                      label="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                    />

                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />

                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <FiAlertCircle />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer bg-primary p-3 rounded-md text-md font-semibold text-background hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>
                </>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="text-center w-full">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheck className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Password Reset Successful!
                  </h2>
                  <p className="text-text mb-8">
                    Your password has been reset successfully. You can now log
                    in with your new password.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block bg-primary text-background px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Go to Login
                  </Link>
                </div>
              )}

              {/* Back to Login Link */}
              {step !== 4 && (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-6 self-center"
                >
                  <FiArrowLeft />
                  Back to Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleVerifyOTP}
        email={email}
        resendOtp={handleResendOTP}
        isLoading={loading}
      />
    </>
  );
}
