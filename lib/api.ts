export async function verifySecretId(secretId: string): Promise<{ success: boolean; data: any }> {
  try {
    const response = await fetch("/api/verify-secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secretId }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, data }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error verifying secret ID:", error)
    return { success: false, data: { message: error.message || "Failed to verify secret ID" } }
  }
}

export async function requestSecretId(email: string): Promise<{ success: boolean; data: any }> {
  try {
    const response = await fetch("/api/generate-secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, data }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error requesting secret ID:", error)
    return { success: false, data: { message: error.message || "Failed to request secret ID" } }
  }
}

export async function submitVote(secretId: string, encryptedVote: string): Promise<{ success: boolean; data: any }> {
  try {
    const response = await fetch("/api/submit-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secretId, encryptedVote }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, data }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error submitting vote:", error)
    return { success: false, data: { message: error.message || "Failed to submit vote" } }
  }
}
