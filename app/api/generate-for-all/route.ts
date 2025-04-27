import { NextResponse } from "next/server"
import crypto from "crypto"
import { encrypt } from "@/lib/encryption"
import { sendEmail } from "@/lib/email"
import { Redis } from '@upstash/redis';

// Initialize Redis from env vars
const redis = Redis.fromEnv();

export async function POST(request: Request) {
  try {
    const mailingList = process.env.MAILING_LIST
      ? process.env.MAILING_LIST.split(",")
      : ["mariamshafey3@gmail.com", "deahmedbacha@gmail.com"] // Default list

    const frontendBaseURL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://sawty-voting.vercel.app/"

    const results = []

    for (const email of mailingList) {
      // Check if there's already a secret ID stored in Redis
      let secretId = await redis.get<string>(`email:${email}`)

      if (!secretId) {
        // If not found, generate a new one
        secretId = crypto.randomBytes(4).toString("hex")

        // Save the secretId -> email mapping
        await redis.set(`email:${email}`, secretId)
        await redis.set(`secret:${secretId}`, email)
      }

      // Encrypt the secret ID for URL
      const encryptedSecretId = encrypt(secretId)
      const loginLink = `${frontendBaseURL}/index?token=${encodeURIComponent(encryptedSecretId)}`

      // Send email
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
