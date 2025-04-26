import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { issuedSecrets } from "@/lib/store"
import { encrypt } from "@/lib/encryption"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    // Get the mailing list from environment variable or database
    const mailingList = process.env.MAILING_LIST
      ? process.env.MAILING_LIST.split(",")
      : ["mariamshafey3@gmail.com", "deahmedbacha@gmail.com"] // Default list

    const results = []

    for (const email of mailingList) {
      // Check if there's already a secret ID for this email
      let secretId = findSecretIdByEmail(email)

      if (!secretId) {
        // Generate a new secret ID
        secretId = crypto.randomBytes(4).toString("hex")
        issuedSecrets[secretId] = email

        // Store in database for persistence
        try {
          const { db } = await connectToDatabase()
          await db.collection("voters").updateOne({ email }, { $set: { secretId } }, { upsert: true })
        } catch (dbError) {
          console.error(`Error storing secret ID for ${email} in database:`, dbError)
          // Continue anyway since we have it in memory
        }
      }

      // Encrypt the secret ID for the URL
      const encryptedSecretId = encrypt(secretId)
      const frontendBaseURL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://sawty-voting.vercel.app/"
      const loginLink = `${frontendBaseURL}/index?token=${encodeURIComponent(encryptedSecretId)}`

      // Send email with the login link
      try {
        await sendEmail({
          to: email,
          subject: "Your Sawty Voting Link",
          text: `Hello,

You have been assigned a secure voting link by Sawty.

Please click the link below to log in and cast your secure vote:

👉 ${loginLink}

This link is encrypted for your privacy.
Please do not share it with anyone.

Thank you,
Sawty Voting Team`,
        })

        console.log(`✅ Secure Voting Link sent to ${email}`)
        results.push({ email, secretId, status: "success" })
      } catch (emailError) {
        console.error(`❌ Failed to send to ${email}`, emailError)
        results.push({ email, status: "failed", error: emailError.message })
      }
    }

    return NextResponse.json({
      message: "Done sending secure links to mailing list",
      results,
    })
  } catch (error) {
    console.error("Error generating secrets for all:", error)
    return NextResponse.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}

// Helper function to find a secret ID by email
function findSecretIdByEmail(email: string) {
  for (const [secretId, mappedEmail] of Object.entries(issuedSecrets)) {
    if (mappedEmail === email) {
      return secretId
    }
  }
  return null
}
