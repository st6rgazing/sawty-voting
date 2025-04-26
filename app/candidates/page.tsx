"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Candidate {
  id: string
  name: string
  position: string
  party: string
  image: string
}

export default function CandidatesPage() {
  const router = useRouter()
  const [candidates] = useState<Candidate[]>([
    {
      id: "cand-jane-92a7",
      name: "Jane Doe",
      position: "Presidential Candidate",
      party: "Progressive Future Party",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "cand-john-5b2f",
      name: "John Smith",
      position: "Presidential Candidate",
      party: "National Unity Alliance",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "cand-emily-7d8c",
      name: "Emily Brown",
      position: "Presidential Candidate",
      party: "Citizens Reform Movement",
      image: "/placeholder.svg?height=400&width=400",
    },
  ])

  const selectCandidate = (candidateId: string) => {
    // In a real app, you would encrypt this
    localStorage.setItem("selectedCandidate", candidateId)
    router.push(`/candidates/${candidateId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              Choose Your Candidate
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Select a candidate to view their profile and cast your vote
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={candidate.image || "/placeholder.svg"}
                    alt={candidate.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">{candidate.position}</p>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                  >
                    {candidate.party}
                  </Badge>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => selectCandidate(candidate.id)}
                  >
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
