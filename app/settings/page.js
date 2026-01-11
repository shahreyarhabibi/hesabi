"use client";

import { useState } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Header from "@/components/header/Header";
import DashboardLayout from "../dashboard/DashboardLayout";
import Image from "next/image";
import bear from "@/public/avatars/bear.png";
import boy from "@/public/avatars/boy.png";
import cat from "@/public/avatars/cat.png";
import chicken from "@/public/avatars/chicken.png";
import gamer from "@/public/avatars/gamer.png";
import man from "@/public/avatars/man.png";
import girl from "@/public/avatars/girl.png";
import user from "@/public/avatars/user.png";
import woman from "@/public/avatars/woman.png";
import woman1 from "@/public/avatars/woman (1).png";

// Avatar options - using DiceBear avatars
const avatarOptions = [
  user,
  bear,
  boy,
  cat,
  chicken,
  gamer,
  man,
  girl,

  woman,
  woman1,
];

// Currency options
const currencyOptions = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "AFN", name: "Afghan Afghani", symbol: "؋" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼" },
];

export default function SettingsPage() {
  // User profile state
  const [userProfile, setUserProfile] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    avatar: user,
    currency: "USD",
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Dark mode state - assuming you have a way to detect/set dark mode
  const [darkMode, setDarkMode] = useState(false);

  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle profile changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Select avatar
  const handleAvatarSelect = (avatarUrl) => {
    setUserProfile((prev) => ({ ...prev, avatar: avatarUrl }));
  };

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would also update the global theme here
    // document.documentElement.classList.toggle('dark');
  };

  // Save settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    // Simulate API call
    setTimeout(() => {
      // Validate password change if trying to change password
      if (
        passwordData.newPassword &&
        passwordData.newPassword !== passwordData.confirmPassword
      ) {
        setMessage({ type: "error", text: "New passwords don't match!" });
        setIsSaving(false);
        return;
      }

      if (passwordData.newPassword && passwordData.newPassword.length < 6) {
        setMessage({
          type: "error",
          text: "Password must be at least 6 characters!",
        });
        setIsSaving(false);
        return;
      }

      // In a real app, you would send this to your backend
      console.log("Saving settings:", {
        profile: userProfile,
        passwordChanged: !!passwordData.newPassword,
        darkMode,
      });

      setMessage({ type: "success", text: "Settings saved successfully!" });

      // Clear password fields after successful save
      if (passwordData.newPassword) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }

      setIsSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <Header
        pageHeader={"Settings"}
        pageSubHeader={"Manage your account settings and preferences."}
        buttonDisplay={"hidden"}
      />

      {/* Message Alert */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : message.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <p>{message.text}</p>
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="text-lg hover:opacity-70"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Left Column - Profile & Avatar */}
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="bg-background shadow-xl dark:bg-linear-45 dark:from-background dark:to-primary/20 border border-text/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold">Profile Settings</h2>
            </div>

            {/* Avatar Selection */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Profile Avatar</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative">
                  <Image
                    src={userProfile.avatar}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-white shadow-lg"
                    unoptimized
                  />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-xl">
                    {userProfile.firstName} {userProfile.lastName}
                  </p>
                  <p className="text-text/70">{userProfile.email}</p>
                </div>
              </div>

              <h4 className="text-sm font-medium mb-5 text-text/70">
                Choose an avatar:
              </h4>
              <div className="flex sm:grid-cols-6 gap-3">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`p-1 rounded-lg transition-all duration-200 ${
                      userProfile.avatar === avatar
                        ? "ring-2 ring-primary bg-primary/10"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Image
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      width={60}
                      height={60}
                      className="rounded-full"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Email */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={userProfile.firstName}
                    onChange={handleProfileChange}
                    className="w-full rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={userProfile.lastName}
                    onChange={handleProfileChange}
                    className="w-full rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 mt-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={userProfile.email}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Security & Preferences */}
        <div className="flex flex-col gap-5">
          {/* Password Card */}
          <div className="bg-background shadow-xl dark:bg-linear-45 dark:from-background dark:to-primary/20 border border-text/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Security Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/50 hover:text-text"
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 mt-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/50 hover:text-text"
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-xl border border-text/20 bg-background dark:bg-gray-900 px-4 py-3 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/50 hover:text-text"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-text/70">
                <p>• Password must be at least 6 characters long</p>
                <p>
                  • Use a mix of letters, numbers, and symbols for better
                  security
                </p>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-background shadow-xl dark:bg-linear-45 dark:from-background dark:to-primary/20 border border-text/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Preferences</h2>

            {/* Currency Selection */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Currency</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currencyOptions.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() =>
                      setUserProfile((prev) => ({
                        ...prev,
                        currency: currency.code,
                      }))
                    }
                    className={`p-3 rounded-xl border transition-all duration-200 text-center ${
                      userProfile.currency === currency.code
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-text/10 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">
                      {currency.symbol}
                    </div>
                    <p className="font-medium text-sm">{currency.code}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div>
              <h3 className="font-semibold mb-4">Theme</h3>
              <div
                onClick={handleToggleDarkMode}
                className="flex items-center justify-between p-4 rounded-xl border border-text/10 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? "bg-gray-800 text-yellow-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {darkMode ? <IoMoon /> : <IoSunny />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </p>
                    <p className="text-sm text-text/70">
                      {darkMode
                        ? "Switch to light theme"
                        : "Switch to dark theme"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button - Full Width */}
      <div className="mt-10">
        <div className="bg-background shadow-xl dark:bg-linear-45 dark:from-background dark:to-primary/20 border border-text/10 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <p className="font-medium">Save your changes</p>
              <p className="text-sm text-text/70">
                All changes will be applied immediately
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setUserProfile({
                    firstName: "Alex",
                    lastName: "Johnson",
                    email: "alex.johnson@example.com",
                    avatar:
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                    currency: "USD",
                  });
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setMessage({
                    type: "info",
                    text: "Settings reset to defaults!",
                  });
                }}
                className="px-6 py-3 rounded-xl border border-text/20 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Reset
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-200 min-w-[140px] ${
                  isSaving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
