import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

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
