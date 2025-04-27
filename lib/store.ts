// In-memory store for issued secret IDs
// In a production app, this would be replaced with a Redis cache or similar
export const issuedSecrets: Record<string, string> = {}
