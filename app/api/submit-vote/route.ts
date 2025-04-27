import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { issuedSecrets } from "@/lib/store"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const { secretId, encryptedVote } = await request.json()

    if (!secretId || !encryptedVote) {
      return NextResponse.json({ message: "Secret ID and vote are required." }, { status: 400 })
    }

    // Check if the secret ID is valid
    if (!issuedSecrets[secretId]) {
      // Check database if not in memory
      const { db } = await connectToDatabase()
      const voter = await db.collection("voters").findOne({ secretId })

      if (!voter) {
        return NextResponse.json({ message: "Invalid or expired Secret ID." }, { status: 400 })
      }

      // Add to in-memory store
      issuedSecrets[secretId] = voter.email
    }

    // Save the vote to the database
    try {
      const { db } = await connectToDatabase()

      await db.collection("votes").insertOne({
        secretId,
        encryptedVote,
        timestamp: new Date().toISOString(),
      })

      // Remove the secret ID from the in-memory store to prevent double voting
      delete issuedSecrets[secretId]

      return NextResponse.json({ message: "Vote submitted securely!" })
    } catch (dbError) {
      console.error("Error saving vote to MongoDB:", dbError)

      // Fallback: Save to local file if database fails
      const votesFile = path.join(process.cwd(), "votes.json")
      let votes = []

      // Read existing votes if file exists
      if (fs.existsSync(votesFile)) {
        const fileContent = fs.readFileSync(votesFile, "utf8")
        votes = JSON.parse(fileContent)
      }

      // Add new vote
      votes.push({
        secretId,
        encryptedVote,
        timestamp: new Date().toISOString(),
      })

      // Write back to file
      fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2))

      return NextResponse.json({ message: "Saved locally due to DB error." })
    }
  } catch (error) {
    console.error("Error submitting vote:", error)
    return NextResponse.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
