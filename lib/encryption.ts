// Simple encryption/decryption utilities for the frontend
// Note: In a real app, you would use a more secure method

export function encrypt(text: string): string {
  // This is a simple base64 encoding for demonstration
  // In a real app, you would use a proper encryption algorithm
  return btoa(text)
}

export function decrypt(token: string): string {
  try {
    // This is a simple base64 decoding for demonstration
    // In a real app, you would use a proper decryption algorithm
    return atob(token)
  } catch (error) {
    console.error("Failed to decrypt token:", error)
    throw new Error("Invalid token format")
  }
}
