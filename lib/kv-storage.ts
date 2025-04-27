import { kv } from "@vercel/kv"

// Key prefixes
const SECRETS_PREFIX = "secrets:"
const VOTES_PREFIX = "votes:"
const ALL_VOTES_KEY = "all_votes"

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

// Secret functions
export async function getSecret(secretId: string): Promise<Secret | null> {
  return await kv.get<Secret>(`${SECRETS_PREFIX}${secretId}`)
}

export async function setSecret(secret: Secret): Promise<void> {
  await kv.set(`${SECRETS_PREFIX}${secret.secretId}`, secret)
}

export async function deleteSecret(secretId: string): Promise<void> {
  await kv.del(`${SECRETS_PREFIX}${secretId}`)
}

export async function getAllSecrets(): Promise<Secret[]> {
  // This is a simplified approach - in a real app with many secrets,
  // you'd need pagination or a different approach
  const keys = await kv.keys(`${SECRETS_PREFIX}*`)
  const secrets: Secret[] = []

  for (const key of keys) {
    const secret = await kv.get<Secret>(key)
    if (secret) {
      secrets.push(secret)
    }
  }

  return secrets
}

// Vote functions
export async function addVote(vote: Vote): Promise<void> {
  // Add to the list of all votes
  await kv.lpush(ALL_VOTES_KEY, vote)

  // Also store individually for potential future access
  await kv.set(`${VOTES_PREFIX}${vote.secretId}`, vote)
}

export async function getAllVotes(): Promise<Vote[]> {
  return (await kv.lrange(ALL_VOTES_KEY, 0, -1)) || []
}

export async function getVoteCount(): Promise<number> {
  return (await kv.llen(ALL_VOTES_KEY)) || 0
}
