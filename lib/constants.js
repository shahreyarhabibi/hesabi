// lib/constants.js
// Default avatar configuration
export const DEFAULT_AVATAR = "/avatars/user.png";

// Helper function to get user avatar with fallback
export function getUserAvatar(userAvatar) {
  // If user has a custom avatar, use it
  if (userAvatar && userAvatar !== DEFAULT_AVATAR) {
    return userAvatar;
  }

  // Otherwise use default avatar
  return DEFAULT_AVATAR;
}

// Helper function to check if user is using default avatar
export function isDefaultAvatar(avatar) {
  return !avatar || avatar === DEFAULT_AVATAR;
}
