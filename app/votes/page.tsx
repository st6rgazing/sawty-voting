"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Vote {
  secretId: string
  encryptedVote: string
  timestamp: string
  decodedVote?: {
    candidateId: string
  }
}

export default function VotesPage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchVotes = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/votes")

      if (!response.ok) {
        throw new Error(`Failed to fetch votes: ${response.status}`)
      }

      const data = await response.json()

      // Try to decode the votes for display
      const processedVotes = data.map((vote: Vote) => {
        try {
          const decodedString = atob(vote.encryptedVote)
          const decodedVote = JSON.parse(decodedString)
          return { ...vote, decodedVote }
        } catch (e) {
          return vote
        }
      })

      setVotes(processedVotes)
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVotes()
  }, [])

  // Count votes by candidate
  const voteCounts: Record<string, number> = {}
  votes.forEach((vote) => {
    if (vote.decodedVote?.candidateId) {
      const candidateId = vote.decodedVote.candidateId
      voteCounts[candidateId] = (voteCounts[candidateId] || 0) + 1
    }
  })

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Votes</h1>
        <Button onClick={fetchVotes} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{votes.length}</p>
          </CardContent>
        </Card>

        {Object.entries(voteCounts).map(([candidateId, count]) => (
          <Card key={candidateId}>
            <CardHeader className="pb-2">
              <CardTitle>Candidate {candidateId}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{count}</p>
              <p className="text-sm text-gray-500">{((count / votes.length) * 100).toFixed(1)}% of total</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vote Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading votes...</div>
          ) : votes.length === 0 ? (
            <div className="text-center py-4">No votes have been cast yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Secret ID</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {votes.map((vote, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">{vote.secretId}</TableCell>
                      <TableCell>
                        {vote.decodedVote?.candidateId ? `Candidate ${vote.decodedVote.candidateId}` : "Unknown"}
                      </TableCell>
                      <TableCell>{new Date(vote.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
