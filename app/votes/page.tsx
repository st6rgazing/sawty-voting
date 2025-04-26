"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Database, Link2 } from "lucide-react"

interface Vote {
  secretId: string
  encryptedVote: string
  timestamp: string
}

export default function VotesPage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadVotes() {
      try {
        const res = await fetch('https://sawty-api.onrender.com/api/admin/votes');
        const data = await res.json()


        // For demo purposes, we'll use mock data
        // const mockVotes: Vote[] = [
        //   {
        //     secretId: "a1b2c3d4e5f6g7h8",
        //     encryptedVote: "cand-jane-92a7",
        //     timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        //   },
        //   {
        //     secretId: "h8g7f6e5d4c3b2a1",
        //     encryptedVote: "cand-john-5b2f",
        //     timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
        //   },
        //   {
        //     secretId: "z9y8x7w6v5u4t3s2",
        //     encryptedVote: "cand-emily-7d8c",
        //     timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 minutes ago
        //   },
        //   {
        //     secretId: "s2t3u4v5w6x7y8z9",
        //     encryptedVote: "cand-jane-92a7",
        //     timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        //   },
        //   {
        //     secretId: "p1o2n3m4l5k6j7i8",
        //     encryptedVote: "cand-john-5b2f",
        //     timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
        //   },
        // ]

        setVotes(data)
        setLoading(false)
      } catch (err) {
        console.error("Failed to load votes:", err)
        setError("Failed to load votes. Please try again later.")
        setLoading(false)
      }
    }

    loadVotes()
  }, [])

  // Function to generate a simple hash for demo purposes
  const cryptoString = (input: string) => {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash).toString(16).padStart(8, "0")
  }

  // Mask the secret ID for privacy
  const maskSecretId = (secretId: string) => {
    return secretId.slice(0, 2) + "***" + secretId.slice(-2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <Link href="/admin" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                Blockchain Votes
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Secure, transparent, and immutable record of all votes cast in the election
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Loading blockchain data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-6" id="blockchain">
              {votes.map((vote, index) => {
                const previousHash =
                  index === 0
                    ? "00000000"
                    : cryptoString(maskSecretId(votes[index - 1].secretId) + votes[index - 1].timestamp)

                return (
                  <div key={index} className="space-y-2">
                    <Card className="p-6 border-0 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                          <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold">Block #{index + 1}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Secret ID:</p>
                          <p className="font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">
                            {maskSecretId(vote.secretId)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Encrypted Vote:</p>
                          <p className="font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">
                            {vote.encryptedVote}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Timestamp:</p>
                          <p className="font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">
                            {new Date(vote.timestamp).toLocaleString()}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Previous Hash:</p>
                          <p className="font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">{previousHash}</p>
                        </div>
                      </div>
                    </Card>

                    {index !== votes.length - 1 && (
                      <div className="flex justify-center py-2">
                        <Link2 className="h-8 w-8 text-purple-400 dark:text-purple-600 rotate-90" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
