import { getKV, setKV, deleteKV } from "@/lib/kv-storage";

// Save a vote
export async function addVote({ secretId, encryptedVote, timestamp }: { secretId: string, encryptedVote: string, timestamp: string }) {
  await setKV(`vote:${secretId}`, JSON.stringify({ secretId, encryptedVote, timestamp }));
}

// Validate a secret
export async function isSecretValid(secretId: string) {
  const email = await getKV(`secret:${secretId}`);
  return !!email;
}

// Remove a secret
export async function removeSecret(secretId: string) {
  await deleteKV(`secret:${secretId}`);
}

// Find secret ID by email
export async function findSecretIdByEmail(email: string) {
  return await getKV<string>(`email:${email}`);
}

// Save a new secret
export async function addSecret(secretId: string, email: string) {
  await setKV(`email:${email}`, secretId);
  await setKV(`secret:${secretId}`, email);
}
