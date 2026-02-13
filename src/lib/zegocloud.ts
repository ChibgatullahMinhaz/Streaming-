/**
 * ZegoCloud Configuration
 * 
 * ZegoCloud provides real-time audio/video communication.
 * The AppID and ServerSecret are used to generate authentication tokens.
 * 
 * IMPORTANT: Replace these with your ZegoCloud Console credentials.
 * Get them from: https://console.zegocloud.com/
 * 
 * Note: In production, token generation should happen server-side.
 * For development, the prebuilt UIKit handles token generation internally.
 */

// TODO: Replace with your ZegoCloud credentials from https://console.zegocloud.com/
export const ZEGO_APP_ID = 370762749; // Your ZegoCloud App ID (number)
export const ZEGO_SERVER_SECRET = "db6b0756836f521a3931a1ecec278dd69dce6a334d1e2ed3ac84e98b71438732"; // Your ZegoCloud Server Secret

/**
 * Generates a random ID for room/user identification.
 * Used when creating or joining stream rooms.
 */
export function generateRoomId(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
