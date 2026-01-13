// components/settings/ThemeToggle.jsx
"use client";

import { memo } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { HiComputerDesktop } from "react-icons/hi2";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: IoSunny },
    { value: "dark", label: "Dark", icon: IoMoon },
    { value: "system", label: "System", icon: HiComputerDesktop },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Theme</h3>
        <p className="text-sm text-text">Choose your preferred theme</p>
      </div>

      <div className="flex gap-3">
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex flex-1 flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
              theme === value
                ? "border-primary bg-primary/10"
                : "border-text/20 hover:border-text/40"
            }`}
          >
            <Icon
              className={`text-2xl ${
                theme === value ? "text-primary" : "text-text"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                theme === value ? "text-primary" : "text-text"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      <p className="text-xs text-text/60">
        Current: {resolvedTheme === "dark" ? "Dark" : "Light"} mode
        {theme === "system" && " (following system)"}
      </p>
    </div>
  );
});

export default ThemeToggle;
