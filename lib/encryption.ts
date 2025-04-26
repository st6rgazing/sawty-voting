import crypto from "crypto"

// Encryption key and IV
const encryptionKey = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012" // 32 characters
const iv = Buffer.alloc(16, 0) // 16 bytes all zeros IV

// Encrypt a string
export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(encryptionKey), iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

// Decrypt a string
export function decrypt(text: string): string {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey), iv)
  let decrypted = decipher.update(text, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

// Generate a cryptographic hash
export function cryptoString(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(16).padStart(8, "0")
}
