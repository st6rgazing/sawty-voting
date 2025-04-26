import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { issuedSecrets } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const { secretId } = await request.json()

    if (!secretId) {
      return NextResponse.json({ valid: false, message: "Secret ID required." }, { status: 400 })
    }

    // Check if the secret ID exists in the issuedSecrets object
    if (issuedSecrets[secretId]) {
      return NextResponse.json({ valid: true, message: "Valid Secret ID." })
    }

    // If not found in memory, check the database
    const { db } = await connectToDatabase()
    const voter = await db.collection("voters").findOne({ secretId })

    if (voter) {
      // Add to in-memory store for faster subsequent checks
      issuedSecrets[secretId] = voter.email
      return NextResponse.json({ valid: true, message: "Valid Secret ID." })
    }

    return NextResponse.json({ valid: false, message: "Invalid or expired Secret ID." }, { status: 400 })
  } catch (error) {
    console.error("Error verifying secret:", error)
    return NextResponse.json({ valid: false, message: "Server error. Please try again later." }, { status: 500 })
  }
}
