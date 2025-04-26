"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Vote } from "lucide-react"

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
    policies: [
      "Transition to 100% renewable energy by 2035",
      "Universal healthcare coverage",
      "Increase minimum wage to $15/hour",
      "Reform criminal justice system",
      "Expand affordable housing programs",
    ],
  },
  {
    id: "2",
    name: "Sam Rivera",
    party: "Liberty Alliance",
    image: "/placeholder.svg?height=300&width=300",
    shortDescription: "Advocating for economic growth and individual freedoms.",
    fullDescription:
      "Sam Rivera is a business leader with a strong track record of creating jobs and stimulating economic growth. Sam believes in reducing regulations that hamper small businesses and advocates for policies that empower individuals to achieve their full potential.",
    policies: [
      "Reduce corporate tax rates to stimulate growth",
      "Simplify the tax code for individuals",
      "Deregulate key industries",
      "Expand school choice programs",
      "Strengthen border security",
    ],
  },
  {
    id: "3",
    name: "Jordan Taylor",
    party: "Unity Coalition",
    image: "/placeholder.svg?height=300&width=300",
    shortDescription: "Building bridges across political divides for common progress.",
    fullDescription:
      "Jordan Taylor has served as a mediator in various political contexts, bringing opposing sides together to find common ground. With experience in both the public and private sectors, Jordan focuses on practical solutions that can gain support across the political spectrum.",
    policies: [
      "Bipartisan infrastructure investment plan",
      "Balanced approach to climate change",
      "Comprehensive immigration reform",
      "Public-private partnerships for healthcare",
      "Education reform with input from all stakeholders",
    ],
  },
  {
    id: "4",
    name: "Morgan Lee",
    party: "Future Forward",
    image: "/placeholder.svg?height=300&width=300",
    shortDescription: "Embracing technology and innovation to solve tomorrow's challenges.",
    fullDescription:
      "Morgan Lee is a tech entrepreneur and policy innovator who believes in harnessing the power of technology to address society's most pressing challenges. Morgan advocates for investment in education, research, and digital infrastructure to prepare citizens for the jobs of the future.",
    policies: [
      "Universal broadband access",
      "STEM education funding increase",
      "Research grants for clean energy technology",
      "Modernize government digital services",
      "Ethical AI development framework",
    ],
  },
]

export default function CandidateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [candidate, setCandidate] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated
    const secretId = localStorage.getItem("secretId")
    if (!secretId) {
      router.push("/")
      return
    }

    // Find the candidate based on the ID from the URL
    const id = params.id as string
    const foundCandidate = candidates.find((c) => c.id === id)

    if (foundCandidate) {
      setCandidate(foundCandidate)
    } else {
      router.push("/candidates")
    }
  }, [params, router])

  if (!candidate) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const handleSelectCandidate = () => {
    localStorage.setItem("selectedCandidate", candidate.id)
    router.push("/candidates")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/candidates")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates
        </Button>

        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="relative h-64 w-full">
            <Image src={candidate.image || "/placeholder.svg"} alt={candidate.name} fill className="object-cover" />
          </div>

          <CardContent className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{candidate.name}</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400">{candidate.party}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-slate-600 dark:text-slate-300">{candidate.fullDescription}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Key Policies</h2>
              <ul className="list-disc pl-5 space-y-1">
                {candidate.policies.map((policy: string, index: number) => (
                  <li key={index} className="text-slate-600 dark:text-slate-300">
                    {policy}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleSelectCandidate}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Vote className="mr-2 h-5 w-5" />
                Select This Candidate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
