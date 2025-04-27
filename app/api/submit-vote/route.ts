import { NextResponse } from "next/server"
import { isSecretValid, removeSecret, addVote } from "@/lib/store"
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
    const { secretId, encryptedVote } = await request.json()

    if (!secretId || !encryptedVote) {
      return NextResponse.json({ message: "Secret ID and vote are required." }, { status: 400 })
    }

    // Check if the secret ID is valid
    if (!isSecretValid(secretId)) {
      return NextResponse.json({ message: "Invalid or expired Secret ID." }, { status: 400 })
    }

    // Save the vote
    try {
      await addVote({
        secretId,
        encryptedVote,
        timestamp: new Date().toISOString(),
      })

      // Remove the secret ID to prevent double voting
      await removeSecret(secretId)

      return NextResponse.json({ message: "Vote submitted securely!" })
    } catch (error) {
      console.error("Error saving vote:", error)

      // More detailed error for debugging
      const errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : String(error)

      return NextResponse.json(
        {
          message: "Error saving vote. Please try again.",
          error: errorMessage,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error submitting vote:", error)

    // More detailed error for debugging
    const errorMessage = error instanceof Error ? `${error.name}: ${error.message}` : String(error)

    return NextResponse.json(
      {
        message: "Server error. Please try again later.",
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
