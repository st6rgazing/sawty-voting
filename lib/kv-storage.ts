import { Redis } from '@upstash/redis';

// Initialize Redis
export const redis = Redis.fromEnv();

// Save a key-value pair
export async function setKV(key: string, value: string) {
  await redis.set(key, value);
}

// Get a value by key
export async function getKV<T = any>(key: string): Promise<T | null> {
  const value = await redis.get(key);
  return value as T;
}

// Delete a key
export async function deleteKV(key: string) {
  await redis.del(key);
}
