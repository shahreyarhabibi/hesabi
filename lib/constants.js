// lib/constants.js
// Default avatar configuration
export const DEFAULT_AVATAR = "/avatars/user.png";

// Available avatar options
export const AVATAR_OPTIONS = [
  "/avatars/user.png",
  "/avatars/bear.png",
  "/avatars/boy.png",
  "/avatars/cat.png",
  "/avatars/chicken.png",
  "/avatars/gamer.png",
  "/avatars/man.png",
  "/avatars/girl.png",
  "/avatars/woman.png",
  "/avatars/woman (1).png",
];

// Currency options
export const CURRENCY_OPTIONS = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "AFN", name: "Afghan Afghani", symbol: "؋" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼" },
];

// Helper function to get user avatar with fallback
export function getUserAvatar(userAvatar) {
  if (userAvatar && userAvatar !== DEFAULT_AVATAR) {
    return userAvatar;
  }
  return DEFAULT_AVATAR;
}

// Helper function to check if user is using default avatar
export function isDefaultAvatar(avatar) {
  return !avatar || avatar === DEFAULT_AVATAR;
}

// Helper function to generate initials from name
export function getInitials(name) {
  if (!name) return "U";
  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
}
