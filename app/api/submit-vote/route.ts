import { NextResponse } from "next/server"
import { isSecretValid, removeSecret, addVote } from "@/lib/store"

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
      return NextResponse.json({ message: "Error saving vote. Please try again." }, { status: 500 })
    }
  } catch (error) {
    console.error("Error submitting vote:", error)
    return NextResponse.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
