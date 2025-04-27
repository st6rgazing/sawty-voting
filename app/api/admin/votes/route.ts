import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
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


export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const votes = await db.collection("votes").find({}).toArray()

    return NextResponse.json(votes)
  } catch (error) {
    console.error("Error fetching votes:", error)
    return NextResponse.json({ message: "Internal server error." }, { status: 500 })
  }
}
