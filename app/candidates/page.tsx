"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Info, ArrowRight, Check } from "lucide-react"

// Mock candidate data - replace with your actual data
const candidates = [
  {
    id: "1",
    name: "Alex Johnson",
    party: "Progressive Party",
    image: "/placeholder.svg?height=300&width=300",
    shortDescription: "Committed to environmental sustainability and social justice.",
    fullDescription:
      "Alex Johnson has been a community organizer for over 15 years, focusing on environmental sustainability initiatives and social justice reforms. With a background in environmental law, Alex has successfully advocated for cleaner energy policies and community-based solutions to climate change.",
  },
  {
    id: "2",
    name: "Sam Rivera",
    party: "Liberty Alliance",
    image: "/placeholder.svg?height=300&width=300",
    shortDescription: "Advocating for economic growth and individual freedoms.",
    fullDescription:
      "Sam Rivera is a business leader with a strong track record of creating jobs and stimulating economic growth. Sam believes in reducing regulations that hamper small businesses and advocates for policies that empower individuals to achieve their full potential.",
  },
  {
    id: "3",
    name: "Jordan Taylor",
    party: "Unity Coalition",
    image: "/placeholder.svg?height=300&width=300",
    shortDescription: "Building bridges across political divides for common progress.",
    fullDescription:
      "Jordan Taylor has served as a mediator in various political contexts, bringing opposing sides together to find common ground. With experience in both the public and private sectors, Jordan focuses on practical solutions that can gain support across the political spectrum.",
  },
  {
    id: "4",
    name: "Morgan Lee",
    party: "Future Forward",
    image: "/placeholder.svg?height=300&width=300",
    shortDescription: "Embracing technology and innovation to solve tomorrow's challenges.",
    fullDescription:
      "Morgan Lee is a tech entrepreneur and policy innovator who believes in harnessing the power of technology to address society's most pressing challenges. Morgan advocates for investment in education, research, and digital infrastructure to prepare citizens for the jobs of the future.",
  },
]

export default function CandidatesPage() {
  const router = useRouter()
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  // Check if user is authenticated
  useEffect(() => {
    const secretId = localStorage.getItem("secretId")
    if (!secretId) {
      router.push("/")
    }
  }, [router])

  const handleVoteNow = () => {
    if (selectedCandidate) {
      // Store selected candidate in localStorage for the confirmation page
      localStorage.setItem("selectedCandidate", selectedCandidate)
      router.push("/confirm-vote")
    }
  }

  const handleCandidateInfo = (candidateId: string) => {
    router.push(`/candidate/${candidateId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Choose Your Candidate</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select a candidate by clicking on their card. Review their information before confirming your vote.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
                selectedCandidate === candidate.id
                  ? "ring-2 ring-purple-500 dark:ring-purple-400 shadow-lg"
                  : "hover:scale-105"
              }`}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              {selectedCandidate === candidate.id && (
                <div className="absolute top-2 right-2 z-10 bg-purple-500 text-white rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCandidateInfo(candidate.id)
                }}
              >
                <Info className="h-4 w-4" />
                <span className="sr-only">More information</span>
              </Button>

              <div className="relative h-48 w-full">
                <Image src={candidate.image || "/placeholder.svg"} alt={candidate.name} fill className="object-cover" />
              </div>

              <CardContent className="pt-4">
                <h3 className="font-bold text-lg">{candidate.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{candidate.party}</p>
                <p className="text-sm">{candidate.shortDescription}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleVoteNow}
            disabled={!selectedCandidate}
            className={`px-8 py-6 rounded-full text-lg transition-all ${
              selectedCandidate
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            }`}
          >
            Vote Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
