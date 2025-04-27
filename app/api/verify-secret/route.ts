import { NextResponse } from "next/server"
import { isSecretValid } from "@/lib/store"
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis from env vars
const redis = Redis.fromEnv();

// Handle POST request
export async function POST(request) {
  // Set an item
  await redis.set("test-key", "Hello from Redis!");

  // Get the item
  const value = await redis.get("test-key");

  return NextResponse.json({ value });
}


export async function POST(request: Request) {
  try {
    const { secretId } = await request.json()

    if (!secretId) {
      return NextResponse.json({ valid: false, message: "Secret ID required." }, { status: 400 })
    }

    // Check if the secret ID is valid
    if (isSecretValid(secretId)) {
      return NextResponse.json({ valid: true, message: "Valid Secret ID." })
    } else {
      return NextResponse.json({ valid: false, message: "Invalid or expired Secret ID." }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying secret:", error)
    return NextResponse.json({ valid: false, message: "Server error. Please try again later." }, { status: 500 })
  }
}
