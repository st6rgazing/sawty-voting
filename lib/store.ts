import {
  setSecret,
  deleteSecret,
  getAllSecrets,
  addVote as storageAddVote,
  getAllVotes as storageGetAllVotes,
} from "./unified-storage"

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

// Initialize the in-memory cache from storage
export async function initializeSecrets(): Promise<void> {
  try {
    const secrets = await getAllSecrets()

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

  // Add to storage
  try {
    await setSecret({
      secretId,
      email,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error adding secret to storage:", error)
  }
}

export async function removeSecret(secretId: string): Promise<void> {
  // Remove from in-memory cache
  delete issuedSecrets[secretId]

  // Remove from storage
  try {
    await deleteSecret(secretId)
  } catch (error) {
    console.error("Error removing secret from storage:", error)
  }
}

export function isSecretValid(secretId: string): boolean {
  return !!issuedSecrets[secretId]
}

export async function addVote(vote: Vote): Promise<void> {
  try {
    await storageAddVote(vote)
  } catch (error) {
    console.error("Error adding vote to storage:", error)
    throw error
  }
}

export async function getAllVotes(): Promise<Vote[]> {
  return await storageGetAllVotes()
}
