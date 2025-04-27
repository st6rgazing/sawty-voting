import { readJsonFile, writeJsonFile, removeFromJsonFile } from "./file-storage"

// File names
const SECRETS_FILE = "secrets.json"
const VOTES_FILE = "votes.json"

// Types
export interface Secret {
  secretId: string
  email: string
  createdAt: string
}

export interface Vote {
  secretId: string
  encryptedVote: string
  timestamp: string
}

// In-memory cache for issued secrets (will reset on server restart)
export const issuedSecrets: Record<string, string> = {}

// Initialize the in-memory cache from the file
export async function initializeSecrets(): Promise<void> {
  try {
    const secrets = await readJsonFile<Secret[]>(SECRETS_FILE, [])

    // Clear the current cache
    Object.keys(issuedSecrets).forEach((key) => delete issuedSecrets[key])

    // Populate the cache
    secrets.forEach((secret) => {
      issuedSecrets[secret.secretId] = secret.email
    })

    console.log(`Loaded ${secrets.length} secrets into memory`)
  } catch (error) {
    console.error("Error initializing secrets:", error)
  }
}

// Helper functions
export function findSecretIdByEmail(email: string): string | null {
  for (const [secretId, mappedEmail] of Object.entries(issuedSecrets)) {
    if (mappedEmail === email) {
      return secretId
    }
  }
  return null
}

export async function addSecret(secretId: string, email: string): Promise<void> {
  // Add to in-memory cache
  issuedSecrets[secretId] = email

  // Add to file storage
  try {
    const secrets = await readJsonFile<Secret[]>(SECRETS_FILE, [])

    // Check if secret already exists
    const existingIndex = secrets.findIndex((s) => s.secretId === secretId)

    if (existingIndex >= 0) {
      // Update existing secret
      secrets[existingIndex] = {
        secretId,
        email,
        createdAt: new Date().toISOString(),
      }
    } else {
      // Add new secret
      secrets.push({
        secretId,
        email,
        createdAt: new Date().toISOString(),
      })
    }

    await writeJsonFile(SECRETS_FILE, secrets)
  } catch (error) {
    console.error("Error adding secret to file:", error)
  }
}

export async function removeSecret(secretId: string): Promise<void> {
  // Remove from in-memory cache
  delete issuedSecrets[secretId]

  // Remove from file storage
  try {
    await removeFromJsonFile<Secret>(SECRETS_FILE, "secretId", secretId)
  } catch (error) {
    console.error("Error removing secret from file:", error)
  }
}

export function isSecretValid(secretId: string): boolean {
  return !!issuedSecrets[secretId]
}

export async function addVote(vote: Vote): Promise<void> {
  try {
    const votes = await readJsonFile<Vote[]>(VOTES_FILE, [])
    votes.push(vote)
    await writeJsonFile(VOTES_FILE, votes)
  } catch (error) {
    console.error("Error adding vote to file:", error)
    throw error
  }
}

export async function getAllVotes(): Promise<Vote[]> {
  return await readJsonFile<Vote[]>(VOTES_FILE, [])
}
