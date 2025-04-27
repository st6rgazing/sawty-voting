import { NextResponse } from "next/server"
import { getAllVotes } from "@/lib/store"

export async function GET(request: Request) {
  try {
    const votes = await getAllVotes()
    return NextResponse.json(votes)
  } catch (error) {
    console.error("Error getting votes:", error)
    return NextResponse.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
