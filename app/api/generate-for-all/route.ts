import { NextResponse } from "next/server"
import crypto from "crypto"
import { encrypt } from "@/lib/encryption"
import { sendEmail } from "@/lib/email"
import { Redis } from '@upstash/redis';

// Initialize Redis with better error handling
let redis: Redis;

try {
  // Initialize Redis from env vars
  redis = Redis.fromEnv();
  console.log("Redis initialized successfully for generate-for-all API");
} catch (error) {
  console.error("Failed to initialize Redis:", error);
  // Create a dummy redis instance to prevent crashes
  redis = {
    get: async (key: string) => { 
      console.log(`[Mock Redis] GET ${key}`);
      return null;
    },
    set: async (key: string, value: string) => {
      console.log(`[Mock Redis] SET ${key} = ${value}`);
      return "OK";
    }
  } as any;
  console.warn("Using mock Redis instance due to initialization failure");
}

export async function POST(request: Request) {
  try {
    // Check that we have the necessary environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials missing! EMAIL_USER or EMAIL_PASS not set.");
      return NextResponse.json({ 
        message: "Server configuration error. Email credentials not configured.",
        error: "Missing email credentials"
      }, { status: 500 });
    }

    console.log("Starting generate-for-all process...");
    
    // Get the mailing list from environment variables
    const mailingList = process.env.MAILING_LIST
      ? process.env.MAILING_LIST.split(",").map(email => email.trim())
      : ["mariamshafey3@gmail.com", "deahmedbacha@gmail.com"] // Default list
    
    console.log(`Mailing list loaded with ${mailingList.length} recipients`);

    // Get the frontend URL from environment variables or use default
    const frontendBaseURL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://sawty-voting.vercel.app"
    console.log(`Using frontend base URL: ${frontendBaseURL}`);

    const results = []

    // Process each email in the mailing list
    for (const email of mailingList) {
      console.log(`Processing email: ${email}`);
      
      try {
        // Check if there's already a secret ID stored in Redis
        let secretId: string | null = null;
        try {
          secretId = await redis.get<string>(`email:${email}`);
          console.log(`Existing secret for ${email}: ${secretId ? "Found" : "Not found"}`);
        } catch (redisError) {
          console.error(`Redis error when getting secret for ${email}:`, redisError);
        }

        if (!secretId) {
          // If not found, generate a new one
          secretId = crypto.randomBytes(4).toString("hex")
          console.log(`Generated new secret ID for ${email}: ${secretId}`);

          // Save the secretId -> email mapping
          try {
            await redis.set(`email:${email}`, secretId)
            await redis.set(`secret:${secretId}`, email)
            console.log(`Saved mappings for ${email} <-> ${secretId}`);
          } catch (redisSaveError) {
            console.error(`Redis error when saving secret for ${email}:`, redisSaveError);
            // Continue anyway, we'll still try to send the email
          }
        }

        // Encrypt the secret ID for URL
        const encryptedSecretId = encrypt(secretId)
        const loginLink = `${frontendBaseURL}/index?token=${encodeURIComponent(encryptedSecretId)}`
        console.log(`Generated login link for ${email}`);

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

          console.log(`✅ Secure Voting Link sent to ${email}`);
          results.push({ email, secretId, status: "success" });
        } catch (emailError) {
          console.error(`❌ Failed to send to ${email}:`, emailError);
          results.push({ 
            email, 
            status: "failed", 
            error: emailError instanceof Error 
              ? emailError.message 
              : String(emailError) 
          });
        }
      } catch (processingError) {
        console.error(`Error processing ${email}:`, processingError);
        results.push({ 
          email, 
          status: "failed", 
          error: "Internal processing error" 
        });
      }
    }

    // Log statistics
    const successCount = results.filter(r => r.status === "success").length;
    const failCount = results.filter(r => r.status === "failed").length;
    console.log(`Generate-for-all completed. Success: ${successCount}, Failed: ${failCount}`);

    return NextResponse.json({
      message: "Done sending secure links to mailing list",
      stats: {
        total: results.length,
        success: successCount,
        failed: failCount
      },
      results,
    })
  } catch (error) {
    console.error("Error in generate-for-all endpoint:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : String(error);
      
    return NextResponse.json({ 
      message: "Server error. Please try again later.",
      error: errorMessage 
    }, { status: 500 })
  }
}
