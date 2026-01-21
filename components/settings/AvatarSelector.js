// components/settings/AvatarSelector.jsx
"use client";

import { memo } from "react";
import Image from "next/image";

const AvatarSelector = memo(function AvatarSelector({
  avatarOptions,
  selectedAvatar,
  onSelect,
}) {
  // Helper to check if avatar is an OAuth/external URL
  const isExternalUrl = (url) => {
    return url?.startsWith("http://") || url?.startsWith("https://");
  };

  return (
    <>
      <h4 className="text-sm font-medium mb-5 text-text/70">
        Choose an avatar:
      </h4>
      <div className="flex flex-wrap sm:grid-cols-6 gap-3">
        {avatarOptions.map((avatarPath, index) => {
          const isOAuth = isExternalUrl(avatarPath);

          return (
            <button
              key={avatarPath}
              type="button"
              onClick={() => onSelect(avatarPath)}
              className={`p-1 rounded-lg transition-all duration-200 relative ${
                selectedAvatar === avatarPath
                  ? "ring-2 ring-primary bg-primary/10"
                  : "hover:bg-gray-600/15"
              }`}
              aria-label={
                isOAuth ? "Your account avatar" : `Select avatar ${index + 1}`
              }
            >
              {/* Badge for OAuth avatar */}
              {isOAuth && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full z-10">
                  You
                </span>
              )}
              <Image
                src={avatarPath}
                alt={isOAuth ? "Your account avatar" : `Avatar ${index + 1}`}
                width={50}
                height={50}
                className="rounded-full"
                // For external URLs, we need unoptimized or configure domains
                unoptimized={isOAuth}
              />
            </button>
          );
        })}
      </div>
    </>
  );
});

export default AvatarSelector;
