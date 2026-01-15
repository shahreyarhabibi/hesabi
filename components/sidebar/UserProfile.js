"use client";

import Image from "next/image";
import { useState } from "react";
import { DEFAULT_AVATAR } from "@/lib/constants";

export default function UserProfile({
  isCollapsed,
  name = "User",
  last_name = "",
  email = "user@example.com",
  avatar = DEFAULT_AVATAR,
  initials = "U",
}) {
  const [imageError, setImageError] = useState(false);

  // Always show avatar image (default or custom)
  // Only show initials if image fails to load
  const showAvatar = avatar && !imageError;

  return (
    <div className="p-6 border-b border-gray-700">
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "space-x-3"
        }`}
      >
        <div className="relative">
          {showAvatar ? (
            <Image
              src={avatar}
              alt={`${name}'s avatar`}
              width={45}
              height={45}
              className="rounded-full ring-2 ring-primary/30"
              onError={() => setImageError(true)}
              unoptimized={avatar.startsWith("http")} // For external URLs
            />
          ) : (
            // Fallback to initials only if image fails to load
            <div className="w-11.25 h-11.25 bg-primary rounded-full flex items-center justify-center text-lg font-bold ring-2 ring-primary/30">
              {initials}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold truncate">
              {name} {last_name}
            </h3>
            <p className="text-text text-sm truncate">{email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
