// components/settings/AvatarSelector.jsx
"use client";

import { memo } from "react";
import Image from "next/image";

const AvatarSelector = memo(function AvatarSelector({
  avatarOptions,
  selectedAvatar,
  onSelect,
}) {
  return (
    <>
      <h4 className="text-sm font-medium mb-5 text-text/70">
        Choose an avatar:
      </h4>
      <div className="flex flex-wrap sm:grid-cols-6 gap-3">
        {avatarOptions.map((avatarPath, index) => (
          <button
            key={avatarPath}
            type="button"
            onClick={() => onSelect(avatarPath)}
            className={`p-1 rounded-lg transition-all duration-200 ${
              selectedAvatar === avatarPath
                ? "ring-2 ring-primary bg-primary/10"
                : "hover:bg-gray-600/15"
            }`}
            aria-label={`Select avatar ${index + 1}`}
          >
            <Image
              src={avatarPath}
              alt={`Avatar ${index + 1}`}
              width={60}
              height={60}
              className="rounded-full"
            />
          </button>
        ))}
      </div>
    </>
  );
});

export default AvatarSelector;
