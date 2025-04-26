// API configuration and utility functions

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// Verify a secret ID
export async function verifySecretId(secretId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/verify-secret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secretId }),
    })
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error("Error verifying secret ID:", error)
    return {
      success: false,
      data: {
        valid: false,
        message: "Failed to verify Secret ID. Please try again later.",
      },
    }
  }
}

// Submit a vote
export async function submitVote(secretId: string, encryptedVote: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/submit-vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secretId, encryptedVote }),
    })
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error("Error submitting vote:", error)
    return {
      success: false,
      data: {
        message: "Failed to submit vote. Please try again later.",
      },
    }
  }
}

// Request a new Secret ID
export async function requestSecretId(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-secret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error("Error requesting Secret ID:", error)
    return {
      success: false,
      data: {
        message: "Failed to request Secret ID. Please try again later.",
      },
    }
  }
}

// Generate Secret IDs for all registered voters (admin function)
export async function generateForAll() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-for-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error("Error generating Secret IDs:", error)
    return {
      success: false,
      data: {
        message: "Failed to generate Secret IDs. Please try again later.",
      },
    }
  }
}

// Get all votes (admin function)
export async function getVotes() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/votes`)
    const data = await response.json()
    return { success: response.ok, data }
  } catch (error) {
    console.error("Error fetching votes:", error)
    return {
      success: false,
      data: [],
    }
  }
}
