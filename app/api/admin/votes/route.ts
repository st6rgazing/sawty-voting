import { NextResponse } from "next/server"
import { Redis } from '@upstash/redis';

// Initialize Redis from env vars
const redis = Redis.fromEnv();

// Fetch all votes
export async function GET(request: Request) {
  try {
    // List all keys matching 'vote:*'
    const { keys } = await redis.scan(0, { match: "vote:*", count: 1000 });

    const votes = [];

    for (const key of keys) {
      const voteData = await redis.get(key);
      if (voteData) {
        votes.push(JSON.parse(voteData));
      }
    }

    return NextResponse.json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
